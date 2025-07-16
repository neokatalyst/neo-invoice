// /pages/profile/index.tsx (View Profile)
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Link from 'next/link';

const ViewProfilePage = () => {
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

  const [loading, setLoading] = useState(true)
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

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">View Profile</h1>

        {error && <div className="text-red-500">{error}</div>}

        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p><strong>Full Name:</strong> {profile.full_name}</p>
            <p><strong>Company Name:</strong> {profile.company_name}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>VAT Number:</strong> {profile.vat_number || 'N/A'}</p>
          </div>

          {profile.logo_url && (
            <div className="mt-2">
              <h2 className="text-xl font-semibold">Logo</h2>
              <img src={profile.logo_url} alt="Logo" className="max-h-24 object-contain border rounded" />
            </div>
          )}
        </div>

        {/* Navigation to Edit Profile */}
        <div className="mt-4 text-center">
          <Link href="/profile/edit-profile" className="text-blue-600 hover:underline">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ViewProfilePage
