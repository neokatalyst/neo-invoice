// /pages/profile/edit-profile.tsx (Edit Profile)
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Link from 'next/link'; // Ensure this is included

const EditProfilePage = () => {
  const router = useRouter()
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    full_name: '',
    company_name: '',
    phone: '',
    address: '',
    vat_number: '',
    logo_url: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin') // Redirect to login page if not logged in
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('User not signed in')
      return
    }

    const full_name =
      profile.full_name.trim() ||
      `${profile.first_name.trim()} ${profile.last_name.trim()}`.trim()

    const updates = {
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name,
      company_name: profile.company_name,
      phone: profile.phone,
      address: profile.address,
      vat_number: profile.vat_number,
      logo_url: profile.logo_url,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase.from('profiles').upsert(updates)

    if (updateError) {
      setError(updateError.message)
      toast.error(updateError.message)
    } else {
      toast.success('Profile updated successfully')
      router.push('/profile') // Redirect to View Profile after update
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Your Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name (optional)</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              placeholder="Defaults to first + last name"
              className="w-full border border-gray-300 p-2 rounded"
              disabled={!!(profile.first_name && profile.last_name)} // Disable if first/last name exists
            />
          </div>

          {/* Add other profile fields here (Company, Phone, Address, etc.) */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/profile" className="text-blue-600 hover:underline">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
