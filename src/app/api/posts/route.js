// app/api/posts/route.js
import { createClientForServer } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClientForServer()
  const { title, content } = await request.json()

  // ✨ 1. 먼저 서버에서 user 가져오기 시도
  let { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    // ✨ 2. 서버 세션에 user 없으면, 클라이언트에서 Authorization 헤더로 토큰 받기
    const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    // ✨ 3. 토큰으로 supabase 클라이언트 새로 만들어서 인증
    const { createClient } = await import('@supabase/supabase-js')

    const tempSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      }
    )

    const { data: sessionUser, error: sessionError } = await tempSupabase.auth.getUser()

    if (!sessionUser || sessionError) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    user = sessionUser
  }

  // 여기까지 오면 user가 무조건 있음
  const { error } = await supabase.from('posts').insert([
    {
      author_id: user.id,
      title,
      content,
    },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
