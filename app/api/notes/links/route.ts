import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServerClient(token)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { sourceNoteId, targetNoteId } = body

  if (!sourceNoteId || !targetNoteId) {
    return NextResponse.json({ error: 'Missing note IDs' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('note_links')
    .select('id')
    .eq('source_note_id', sourceNoteId)
    .eq('target_note_id', targetNoteId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(existing)
  }

  const { data, error } = await supabase
    .from('note_links')
    .insert({
      source_note_id: sourceNoteId,
      target_note_id: targetNoteId,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}