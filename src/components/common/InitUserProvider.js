'use client'

import { useEffect } from 'react'
import useUserStore from '@/app/stores/useUserStore'

export default function InitUserProvider({ children }) {
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return <>{children}</>
}
