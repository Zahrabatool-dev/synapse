import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getGeminiModel } from '@/lib/gemini'

interface NoteForContext {
  id: string
  title: string
  content: unknown
}

function extractPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; content?: unknown[] }
  let text = n.text ? n.text : ''
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      text += extractPlainText(child) + ' '
    }
  }
  return text
}

async function getAuthedClient(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null

  const supabase = createSupabaseServerClient(token)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  return { supabase, user }
}

export async function POST(request: NextRequest) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed

  const body = await request.json()
  const { message, history, conversationId } = body as {
    message: string
    history: { role: 'user' | 'model'; text: string }[]
    conversationId: string
  }

  if (!message || !conversationId) {
    return NextResponse.json({ error: 'Message and conversationId are required' }, { status: 400 })
  }

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('id, title, content')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 })
  }

  const notesWithText = (notes as NoteForContext[]).map((n) => ({
    id: n.id,
    title: n.title,
    text: extractPlainText(n.content).replace(/\s+/g, ' ').trim(),
  }))

  const queryWords = message.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const scored = notesWithText.map((n) => {
    const haystack = (n.title + ' ' + n.text).toLowerCase()
    const score = queryWords.reduce(
      (acc, word) => acc + (haystack.includes(word) ? 1 : 0),
      0
    )
    return { ...n, score }
  })

  const relevant = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .filter((n) => n.text.length > 0)

  const contextBlock = relevant
    .map((n) => `[[Note: ${n.title}]]\n${n.text.slice(0, 800)}`)
    .join('\n\n---\n\n')

  const tone = user.user_metadata?.ai_tone || 'balanced'
  const toneInstruction =
    tone === 'concise'
      ? 'Keep answers very brief and to the point — 1-3 sentences when possible.'
      : tone === 'detailed'
      ? 'Give thorough, in-depth answers with context and explanation.'
      : 'Keep answers clear and moderately detailed — a short paragraph is fine.'

  const systemInstruction = `You are Synapse, an AI assistant that helps users understand and connect ideas from their own notes.
Answer the user's question using ONLY the note content provided below as context. If the notes don't contain relevant information, say so honestly instead of making things up.
${toneInstruction}

NOTES CONTEXT:
${contextBlock || '(No relevant notes found)'}`

  try {
    const model = getGeminiModel(systemInstruction)

    const chatHistory = (history || []).map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }))

    const chat = model.startChat({
      history: chatHistory,
    })

    let result
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await chat.sendMessage(message)
        break
      } catch (err) {
        lastError = err
        const isOverloaded = err instanceof Error && err.message.includes('503')
        if (!isOverloaded || attempt === 2) throw err
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
      }
    }

    if (!result) throw lastError
    const responseText = result.response.text()
    const sources = relevant.map((n) => ({ id: n.id, title: n.title }))

    await supabase.from('chat_messages').insert([
      { user_id: user.id, conversation_id: conversationId, role: 'user', content: message },
      { user_id: user.id, conversation_id: conversationId, role: 'model', content: responseText, sources },
    ])

    if (!history || history.length === 0) {
      try {
        const titleModel = getGeminiModel()
        const titleResult = await titleModel.generateContent(
          `Generate a very short title (max 5 words, no quotes) summarizing this chat message: "${message}"`
        )
        const title = titleResult.response.text().trim().slice(0, 60)
        await supabase
          .from('chat_conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', conversationId)
      } catch {
        // title generation fail ho to bhi koi baat nahi
      }
    } else {
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
    }

    return NextResponse.json({ reply: responseText, sources })
  } catch (err) {
    console.error('Gemini error:', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}