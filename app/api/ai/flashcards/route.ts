import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getGeminiModel } from '@/lib/gemini'

interface NoteContent {
  content?: unknown
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

// GET: kisi note ke existing flashcards laao
export async function GET(request: NextRequest) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase } = authed

  const noteId = request.nextUrl.searchParams.get('noteId')
  if (!noteId) return NextResponse.json({ error: 'noteId is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('note_id', noteId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: naye flashcards generate karo AI se
export async function POST(request: NextRequest) {
  const authed = await getAuthedClient(request)
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { supabase, user } = authed

  const body = await request.json()
  const { noteId } = body as { noteId: string }

  if (!noteId) return NextResponse.json({ error: 'noteId is required' }, { status: 400 })

  const { data: note, error: noteError } = await supabase
    .from('notes')
    .select('id, title, content')
    .eq('id', noteId)
    .eq('user_id', user.id)
    .single()

  if (noteError || !note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  const plainText = extractPlainText((note as NoteContent).content)
    .replace(/\s+/g, ' ')
    .trim()

  if (plainText.length < 20) {
    return NextResponse.json(
      { error: 'This note needs more content before generating flashcards' },
      { status: 400 }
    )
  }

  const prompt = `Based on the following note titled "${note.title}", generate 5-8 flashcards (question and answer pairs) that test understanding of the key concepts.

Respond ONLY with valid JSON in this exact format, no markdown formatting, no code fences:
[{"question": "...", "answer": "..."}]

Note content:
${plainText.slice(0, 4000)}`

  try {
    const model = getGeminiModel()

    let result
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await model.generateContent(prompt)
        break
      } catch (err) {
        const isOverloaded = err instanceof Error && err.message.includes('503')
        if (!isOverloaded || attempt === 2) throw err
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
      }
    }

    if (!result) throw new Error('No result from Gemini')

    let raw = result.response.text().trim()
    raw = raw.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

    const parsed: { question: string; answer: string }[] = JSON.parse(raw)

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid response format')
    }

    const rowsToInsert = parsed.map((card) => ({
      note_id: noteId,
      question: card.question,
      answer: card.answer,
    }))

    const { data: inserted, error: insertError } = await supabase
      .from('flashcards')
      .insert(rowsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(inserted, { status: 201 })
  } catch (err) {
    console.error('Flashcard generation error:', err)
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
  }
}