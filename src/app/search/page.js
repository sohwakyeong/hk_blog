'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/common/Header'
import PostGrid from '@/components/post/PostGrid'
import useUserStore from '@/app/stores/useUserStore'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const darkMode = useUserStore((state) => state.darkMode)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, summary, thumbnail_url, created_at, author_id')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })

    if (!data || error) {
      console.error('검색 실패', error)
      setResults([])
      setLoading(false)
      return
    }

    const enriched = await Promise.all(
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

    setResults(enriched)
    setLoading(false)
  }

  return (
    <div className={`${darkMode ? 'bg-[#111] text-[#eee]' : 'bg-[#FAFAFA] text-[#111]'} min-h-screen`}>
      <Header titleSuffix="검색" />

      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="w-full flex items-center border border-[#E5E5E5] rounded-full overflow-hidden transition-all duration-300 px-4 py-2 gap-2
          bg-white text-black dark:bg-[#222] dark:text-white dark:border-[#444] mb-8">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white dark:bg-white dark:text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition"
          >
            검색하기
          </button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-gray-400">🔍 검색 중...</p>
        ) : (
          <PostGrid
            posts={results}
            darkMode={darkMode}
            onClickPost={(id) => window.location.href = `/post/${id}`}
          />
        )}
      </div>
    </div>
  )
}
