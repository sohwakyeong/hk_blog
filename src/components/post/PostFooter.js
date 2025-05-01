'use client'

import CommentContent from '@/components/comment/CommentContent'

export default function PostFooter({ author }) {
  return (
    <>
      <div className="text-sm text-gray-600 text-right mb-12">
        by <span className="font-semibold">{author}</span>
      </div>

     <CommentContent />
    </>
  )
}
