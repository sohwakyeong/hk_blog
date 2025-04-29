'use client'

import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabaseClient'
import { signOutFromServer } from '@/app/actions/signout-action'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeClient() {
  const { user, setUser } = useUser()
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()        
    setUser(null)                        
    await signOutFromServer()           
    window.location.href = '/'               
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">메인페이지</h1>
      {user ? (
        <>
          <p className="mb-4">로그인된 유저: {user.email}</p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <p className="text-gray-500">로그인이 필요합니다</p>
      )}
    </div>
  )
}
