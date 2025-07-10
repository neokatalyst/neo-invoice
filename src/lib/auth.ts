import { supabase } from './supabaseClient'

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Sign out error:', error.message)
  else window.location.href = '/signin'  // redirect after sign-out
}
