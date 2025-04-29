import { createClientForServer } from '@/lib/server'
import HomeClient from './HomeClient'

export default async function Home() {
  const supabase = await createClientForServer()

  const { data, error } = await supabase.auth.getUser()
  console.log('user data:', data)

  const user = data?.user || null

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    console.log('profile 조회 결과:', profile)
    console.log('profile 조회 에러:', profileError)

    if (!profile && profileError?.code === 'PGRST116') {
      const { user_metadata = {} } = user
      const { name = '' } = user_metadata

      const { data: insertData, error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          nickname: name || user.email.split('@')[0],
          blog_name: '',
        },
      ])

      console.log('profiles insert 결과:', insertData)
      console.log('profiles insert 에러:', insertError)
    }
  }

  return <HomeClient initialUser={user} />
}
