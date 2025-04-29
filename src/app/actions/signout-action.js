'use server'

import { createClientForServer } from '@/lib/server'

export async function signOutFromServer() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  return { success: true }
}