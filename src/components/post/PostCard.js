'use client'

import Image from 'next/image'

export default function PostCard({ post, darkMode, onClick }) {
  return (
    <div
      className={`shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col ${
        darkMode ? 'bg-[#1A1A1A]' : 'bg-white'
      }`}
      onClick={onClick}
    >
      {post.thumbnail_url && (
        <div className="relative w-full h-45">
          <Image
            src={post.thumbnail_url}
            alt="썸네일"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="p-3 flex flex-col justify-between flex-1">
        <h2 className="text-lg font-bold mb-2 line-clamp-1">{post.title}</h2>

        {post.summary && (
          <p className="text-sm text-gray-700 dark:text-[#ccc] mb-3 line-clamp-2">
            {post.summary}
          </p>
        )}

        <span className="text-sm text-gray-400 dark:text-[#aaa] mb-4">
          {new Date(post.created_at).toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>

        <div
          className={`flex items-center gap-2 pt-2 border-t ${
            darkMode ? 'border-[#333]' : 'border-gray-200'
          }`}
        >
          <Image
            src={post.profile_url}
            alt="작성자 프로필"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <span className="text-sm text-gray-600 dark:text-[#ccc]">
            by {post.nickname}
          </span>
        </div>
      </div>
    </div>
  )
}
