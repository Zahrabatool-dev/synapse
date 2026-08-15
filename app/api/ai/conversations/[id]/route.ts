import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function getAuthedClient(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null

  const supabase = createSupabaseServerClient(token)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  return { supabase, user }
}

// GET: is conversation ke saare messages laao
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase } = authed
  const { id } = await params

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH: rename karo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed
  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from('chat_conversations')
    .update({ title: body.title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE: conversation delete karo (messages cascade se delete ho jayenge)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed
  const { id } = await params

  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}