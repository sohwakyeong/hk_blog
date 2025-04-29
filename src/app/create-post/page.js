'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function CreatePost() {
  const { user } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setErrorMsg('로그인이 필요합니다.')
      return
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.access_token && { 'Authorization': `Bearer ${user.access_token}` }), // 자체 로그인 토큰 있을 경우만
      },
      body: JSON.stringify({ title, content }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      const { error } = await res.json()
      setErrorMsg('글 작성 실패: ' + (error || '알 수 없는 오류'))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">글 작성</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-lg"
          required
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded-lg min-h-[200px]"
          required
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          작성하기
        </button>
      </form>
    </div>
  )
}
