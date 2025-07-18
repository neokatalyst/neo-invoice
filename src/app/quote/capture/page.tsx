'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

type LineItem = {
  description: string;
  quantity: number;
  price: number;
}

export default function QuoteCapturePage() {
  const router = useRouter()

  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

const handleItemChange = (
  index: number,
  field: keyof LineItem,
  value: string | number
) => {
  const updated = [...items];
  
  updated[index] = {
    ...updated[index],
    [field]: field === 'quantity' || field === 'price'
      ? Number(value)
      : String(value)
  };

  setItems(updated);
};


  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('Not signed in')

    const { error } = await supabase.from('quotes').insert({
      user_id: user.id,
      client_name: clientName,
      client_email: clientEmail,
      items,
      total: calculateTotal(),
      status: 'draft',
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Quote created!')
      router.push('/quote/list')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block mb-1">Client Name</label>
            <input className="w-full border p-2 rounded" value={clientName} onChange={e => setClientName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Client Email</label>
            <input className="w-full border p-2 rounded" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="border p-2 rounded space-y-2 mb-2">
              <input
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={item.description}
                onChange={e => handleItemChange(idx, 'description', e.target.value)}
                required
              />
              <input
                className="w-full border p-2 rounded"
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                required
              />
              <input
                className="w-full border p-2 rounded"
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={e => handleItemChange(idx, 'price', e.target.value)}
                required
              />
              <button type="button" className="text-red-600" onClick={() => removeItem(idx)}>Remove</button>
            </div>
          ))}

          <button type="button" className="w-full bg-gray-200 p-2 rounded" onClick={addItem}>
            + Add Item
          </button>

          <p className="text-right font-bold">Total: R {calculateTotal().toFixed(2)}</p>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Quote'}
          </button>
        </form>
      </div>
    </div>
  )
}
