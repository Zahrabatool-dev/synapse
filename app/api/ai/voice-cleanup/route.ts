import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getGeminiModel } from '@/lib/gemini'

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
  const { text } = body as { text: string }

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 })
  }

  const prompt = `Clean up the following voice-transcribed text. Remove filler words (um, uh, like, you know), fix obvious grammar mistakes, and add proper punctuation. Keep the original meaning, tone, and language exactly as spoken — do not translate it. Respond with ONLY the cleaned text, no explanation, no quotes.

Transcribed text:
${text}`

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

    const cleaned = result.response.text().trim()

    return NextResponse.json({ cleaned })
  } catch (err) {
    console.error('Voice cleanup error:', err)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}