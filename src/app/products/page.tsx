'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    price: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const saveProduct = async () => {
    const { name, sku, price, description } = product

    if (!name || !sku || !price) {
      toast.error('Name, SKU, and Price are required.')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        sku,
        price: parseFloat(price),
        description,
      },
    ])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Product saved successfully!')
      setProduct({ name: '', sku: '', price: '', description: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            name="sku"
            placeholder="SKU"
            value={product.sku}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <button
            onClick={saveProduct}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  )
}
