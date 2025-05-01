'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/common/Header'
import PostGrid from '@/components/post/PostGrid'
import useUserStore from '@/app/stores/useUserStore'

export default function MainPage() {
  const router = useRouter()
  const darkMode = useUserStore((state) => state.darkMode)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, summary, thumbnail_url, created_at, author_id')
        .order('created_at', { ascending: false })

      if (!data || error) {
        console.error('글 불러오기 실패', error)
        setLoading(false)
        return
      }

      const enrichedPosts = await Promise.all(
        data.map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname, profile_url')
            .eq('id', post.author_id)
            .single()

          return {
            ...post,
            nickname: profile?.nickname || '익명',
            profile_url: profile?.profile_url || '/userbasicimg.png',
          }
        })
      )

      setPosts(enrichedPosts)
      setLoading(false)
    }

    fetchPosts()
  }, [])

  return (
    <div
      className={`${
        darkMode ? 'bg-[#111] text-[#F5F5F5]' : 'bg-[#FAFAFA] text-[#111]'
      } min-h-screen transition-colors duration-300`}
    >
      {!loading && <Header titleSuffix="" />}

      <div className="max-w-5xl mx-auto py-10 px-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin dark:border-gray-600" />
          </div>
        ) : (
          <PostGrid
            posts={posts}
            darkMode={darkMode}
            onClickPost={(id) => router.push(`/post/${id}`)}
          />
        )}
      </div>
    </div>
  )
}
