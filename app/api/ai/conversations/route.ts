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

// GET: saari conversations list karo
export async function GET(request: NextRequest) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed

  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: nayi conversation banao
export async function POST(request: NextRequest) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: user.id, title: 'New chat' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}