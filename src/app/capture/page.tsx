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
import { calculateVat, formatCurrency, type SupportedCurrency } from '@/lib/formatting'

export default function CreateInvoicePage() {
  useAuthRedirect()

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    contact_number: '',
    status: 'unpaid',
    items: [{ sku: '', description: '', quantity: 1, unit_price: 0 }]
  })

  const [settings, setSettings] = useState<{
    currency: SupportedCurrency
    vat_rate: number
    vat_inclusive: boolean
  }>({
    currency: 'ZAR',
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
      if (data) {
        const validCurrencies: SupportedCurrency[] = ['ZAR', 'USD', 'EUR', 'GBP']
        const currency = validCurrencies.includes(data.currency) ? data.currency : 'ZAR'

        setSettings({
          currency,
          vat_rate: data.vat_rate,
          vat_inclusive: data.vat_inclusive
        })
      }
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('User not authenticated')
      setLoading(false)
      return
    }

    const reference = `INV${Math.floor(100000 + Math.random() * 900000)}`

    const invoiceItems = formData.items.map(i => ({
      sku: i.sku,
      description: i.description,
      quantity: i.quantity,
      price: i.unit_price,
    }))

    const { error } = await supabase.from('invoices').insert([
      {
        client_name: formData.client_name,
        client_email: formData.client_email,
        contact_number: formData.contact_number,
        items: invoiceItems,
        subtotal,
        vat,
        total,
        currency: settings.currency,
        reference,
        status: formData.status,
        created_at: new Date().toISOString(),
        user_id: user.id,
      },
    ])

    if (error) {
      toast.error(error.message)
      setError(error.message)
    } else {
      toast.success('Invoice created!')
      router.push('/client-dashboard/invoices')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
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

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 pt-2">
                  <input
                    placeholder="SKU"
                    value={item.sku}
                    onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="border border-gray-300 p-2 rounded col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <div className="flex items-center px-2 font-medium">
                    {formatCurrency(item.quantity * item.unit_price, settings.currency)}
                  </div>
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
            {loading ? 'Saving...' : 'Create Invoice'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/client-dashboard/invoices" className="inline-block px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}