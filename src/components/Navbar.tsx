import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out failed:', error.message)
      return
    }
    router.push('/signin')
  }

  return <button onClick={handleSignOut}>Sign Out</button>
}
