'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const UserContext = createContext(null)

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    const syncUser = async () => {
      const { data } = await supabase.auth.getUser()


      if (data?.user) {
        setUser(data.user)
      } else if (!data?.user && !user && initialUser) {
      
        setUser(initialUser)
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      syncUser()
    })

    syncUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [initialUser, user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
