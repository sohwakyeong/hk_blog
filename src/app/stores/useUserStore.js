import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

const useUserStore = create((set) => ({
  user: null,
  isAdmin: false,
  darkMode: false,

  fetchUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const savedDark = localStorage.getItem('darkMode')
    const darkMode = savedDark ? JSON.parse(savedDark) : false

    if (!user) {
      set({ user: null, isAdmin: false, darkMode })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, blog_name, profile_url, admin')
      .eq('id', user.id)
      .single()

    set({
      user: {
        ...user,
        nickname: profile?.nickname || '',
        blog_name: profile?.blog_name || '',
        profile_url: profile?.profile_url || '/userbasicimg.png',
      },
      isAdmin: profile?.admin === true,
      darkMode,
    })
  },

  setDarkMode: (value) => {
    localStorage.setItem('darkMode', JSON.stringify(value))
    set({ darkMode: value })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAdmin: false })
  },
}))

export default useUserStore
