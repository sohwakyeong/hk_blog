'use client'

import dynamic from 'next/dynamic'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Viewer),
  { ssr: false }
)

export default function PostContent({ content }) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-sm mb-10">
      <Viewer initialValue={content} />
    </div>
  )
}
