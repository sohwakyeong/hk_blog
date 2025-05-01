'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { showError, showSuccess } from '@/lib/toast'
import TuiEditor from '@/components/common/TuiEditor'
import useUserStore from '@/app/stores/useUserStore'
import BackButton from '@/components/common/BackButton'

export default function PostEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const editorRef = useRef()
  const darkMode = useUserStore((state) => state.darkMode)
  const user = useUserStore((state) => state.user)
  const isAdmin = useUserStore((state) => state.isAdmin)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        showError('게시글을 불러오지 못했습니다.')
        router.back()
        return
      }

     
      if (!user) return

   
      if (user.id !== data.author_id && !isAdmin) {
        showError('접근 권한이 없습니다.')
        router.back()
        return
      }

      setTitle(data.title)
      setContent(data.content)
      setLoading(false)
    }

    fetchPost()
  }, [id, user, isAdmin, router])

  function sanitizeFilename(name) {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_.-]/g, '')
  }

  async function handleUpdate() {
    const newContent = editorRef.current?.getInstance().getMarkdown()
    const html = editorRef.current?.getInstance().getHTML()

    if (!title.trim() || !newContent.trim()) {
      showError('제목과 내용을 모두 입력해 주세요.')
      return
    }

    const imgMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*>/)
    const firstImageUrl = imgMatch?.[1] || null

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          content: newContent,
          thumbnail_url: firstImageUrl,
        })
        .eq('id', id)

      if (error) {
        showError('글 수정 실패!')
        return
      }

      showSuccess('글이 수정되었습니다!')
      router.push(`/post/${id}`)
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <div className={`${darkMode ? 'bg-[#111] text-[#eee]' : 'bg-[#FAFAFA] text-[#111]'} min-h-screen`}>
      <div className="flex flex-col max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <button
            onClick={handleUpdate}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors
              ${darkMode
                ? 'bg-white text-black hover:bg-[#ddd]'
                : 'bg-black text-white hover:bg-[#333]'
              }`}
          >
            수정 완료
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-5xl font-bold mb-4 outline-none bg-transparent placeholder-gray-400"
        />

        <div className="bg-white p-6 rounded shadow-sm mt-5 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TuiEditor
              ref={editorRef}
              initialValue={content}
              previewStyle="vertical"
              height="500px"
              initialEditType="markdown"
              hideModeSwitch={true}
              useCommandShortcut={true}
              hooks={{
                addImageBlobHook: async (blob, callback) => {
                  const ext = blob.type.split('/')[1]
                  const safeName = `${Date.now()}_${sanitizeFilename(blob.name || 'image')}`

                  const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(safeName, blob)

                  if (error) {
                    showError('에디터 이미지 업로드 실패')
                    return
                  }

                  const url = supabase.storage.from(bucket).getPublicUrl(safeName).data.publicUrl
                  callback(url, safeName)
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
