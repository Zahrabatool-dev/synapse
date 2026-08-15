import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
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

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('id, title')
    .eq('user_id', user.id)

  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 })
  }

  const noteIds = notes.map((note) => note.id)

  const { data: links, error: linksError } = await supabase
    .from('note_links')
    .select('id, source_note_id, target_note_id')
    .in('source_note_id', noteIds.length > 0 ? noteIds : [''])

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 })
  }

  const nodes = notes.map((note) => ({
    id: note.id,
    data: { label: note.title },
  }))

  const edges = links.map((link) => ({
    id: link.id,
    source: link.source_note_id,
    target: link.target_note_id,
  }))

  return NextResponse.json({ nodes, edges })
}