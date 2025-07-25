'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

type LineItem = {
  description: string
  quantity: number
  price: number
}

export default function Page() {
  const router = useRouter()
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items]
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' || field === 'price'
        ? Number(value)
        : String(value)
    }
    setItems(updated)
  }

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const generateReference = () => `Q${Math.floor(100000 + Math.random() * 900000)}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not signed in')
      setLoading(false)
      return
    }

    const total = calculateTotal()
    const reference = generateReference()

    const { error } = await supabase.from('quotes').insert({
      user_id: user.id,
      client_name: clientName,
      client_email: clientEmail,
      items,
      total,
      reference,
      status: 'draft',
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Quote created')
      router.push('/quote')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Quote</h1>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} required />
          <input className="w-full border p-2 rounded" placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />

          {items.map((item, idx) => (
            <div key={idx} className="p-2 border rounded space-y-2">
              <input className="w-full border p-2 rounded" placeholder="Description"
                value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} required />
              <input type="number" className="w-full border p-2 rounded" placeholder="Quantity"
                value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} required />
              <input type="number" className="w-full border p-2 rounded" placeholder="Price"
                value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} required />
              <button type="button" onClick={() => removeItem(idx)} className="text-red-600">Remove</button>
            </div>
          ))}

          <button type="button" onClick={addItem} className="w-full bg-gray-200 p-2 rounded">+ Add Item</button>

          <p className="text-right font-bold">Total: R {calculateTotal().toFixed(2)}</p>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Quote'}
          </button>
        </form>
      </div>
    </div>
  )
}
