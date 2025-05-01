'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import useUserStore from '@/app/stores/useUserStore'

export default function BackButton({ label = '나가기' }) {
  const router = useRouter()
  const darkMode = useUserStore((state) => state.darkMode)

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-1 text-base font-bold hover:underline ${
        darkMode ? 'text-white' : 'text-black'
      }`}
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  )
}
