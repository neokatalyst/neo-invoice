'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAuthRedirect } from '@/lib/useAuthRedirect'
import Header from '@/components/Header'
import ProductSelector from '@/components/ProductSelector'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { calculateVat, formatCurrency, SupportedCurrency } from '@/lib/formatting'

export default function CreateQuotePage() {
  useAuthRedirect()

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    contact_number: '',
    status: 'draft',
    items: [{ sku: '', description: '', quantity: 1, unit_price: 0 }]
  })

  const [settings, setSettings] = useState({
    currency: 'ZAR' as SupportedCurrency,
    vat_rate: 15,
    vat_inclusive: true
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('currency,vat_rate,vat_inclusive').eq('user_id', user.id).single()
      if (data) setSettings({
        currency: data.currency as SupportedCurrency,
        vat_rate: data.vat_rate ?? 15,
        vat_inclusive: data.vat_inclusive ?? true
      })
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: keyof typeof formData.items[0], value: string | number) => {
  setFormData(prev => {
    const items = [...prev.items]
    items[index] = {
      ...items[index],
      [field]: field === 'quantity' || field === 'unit_price' ? parseFloat(value as string) : value
    }
    return { ...prev, items }
  })
}


  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { sku: '', description: '', quantity: 1, unit_price: 0 }] }))
  }

  const totalAmount = formData.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)
  const { subtotal, vat, total } = calculateVat(totalAmount, settings.vat_rate, settings.vat_inclusive)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('User not authenticated')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('logo_url').eq('user_id', user.id).single()
    const reference = `Q${Math.floor(100000 + Math.random() * 900000)}`

    const { error: insertError } = await supabase.from('quotes').insert([
      {
        client_name: formData.client_name,
        client_email: formData.client_email,
        contact_number: formData.contact_number,
        items: formData.items,
        subtotal,
        vat,
        total,
        currency: settings.currency,
        reference,
        logo_url: profile?.logo_url ?? null,
        status: formData.status,
        created_at: new Date().toISOString(),
        user_id: user.id,
      },
    ])

    if (insertError) {
      toast.error(insertError.message)
      setError(insertError.message)
    } else {
      toast.success('Quote created!')
      router.push('/quote')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Quote</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="client_name" placeholder="Client Name" value={formData.client_name} onChange={handleInputChange} required className="w-full border border-gray-300 p-2 rounded" />
          <input name="client_email" type="email" placeholder="Client Email" value={formData.client_email} onChange={handleInputChange} required className="w-full border border-gray-300 p-2 rounded" />
          <input name="contact_number" type="tel" placeholder="Contact Number" value={formData.contact_number} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded" />

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="space-y-2 border p-4 rounded bg-white shadow-sm relative">
                <ProductSelector
                  onSelect={(product) => {
                    handleItemChange(index, 'sku', product.sku)
                    handleItemChange(index, 'description', product.description)
                    handleItemChange(index, 'unit_price', product.unit_price)
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                  <input
                    name="sku"
                    placeholder="SKU"
                    value={item.sku}
                    onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="border border-gray-300 p-2 rounded col-span-2"
                  />
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <input
                    name="unit_price"
                    type="number"
                    placeholder="Price"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                </div>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        items: prev.items.filter((_, i) => i !== index)
                      }))
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {item.sku && item.description && item.unit_price > 0 && (
                  <div className="text-sm pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const { data: existing } = await supabase
                          .from('products')
                          .select('id')
                          .eq('sku', item.sku)
                          .maybeSingle()

                        if (existing) {
                          toast('Product already exists')
                          return
                        }

                        const { data: userData } = await supabase.auth.getUser()
                        const userId = userData?.user?.id

                        const { error } = await supabase.from('products').insert([
                          {
                            sku: item.sku,
                            description: item.description,
                            unit_price: item.unit_price,
                            created_by: userId,
                          },
                        ])

                        if (error) toast.error('Failed to save product')
                        else toast.success('Product saved')
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Save this product to Products
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-blue-600 hover:underline">
              + Add Item
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-1">
            <p>Subtotal: {formatCurrency(subtotal, settings.currency)}</p>
            <p>VAT ({settings.vat_rate}%): {formatCurrency(vat, settings.currency)}</p>
            <p><strong>Total: {formatCurrency(total, settings.currency)}</strong></p>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Saving...' : 'Create Quote'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/quote" className="inline-block px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
            Go to Quotes
          </Link>
        </div>
      </div>
    </div>
  )
}