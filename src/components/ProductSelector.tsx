'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'

type Product = {
  id: string
  sku: string
  description: string
  unit_price: number
}

type Props = {
  onSelect: (product: Product) => void
}

export default function ProductSelector({ onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*')
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (search.length < 3) {
      setFiltered([])
      return
    }

    setFiltered(
      products.filter(p =>
        `${p.sku} ${p.description}`.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, products])

  return (
    <div className="space-y-1">
      <Input
        placeholder="Search SKU or description"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        className="bg-white"
      />
      {filtered.length > 0 && (
        <ul className="max-h-40 overflow-y-auto border rounded bg-white text-sm p-2 shadow">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => {
                onSelect(p)
                setSearch('')
              }}
            >
              <strong>{p.sku}</strong> — {p.description} (R {p.unit_price})
            </li>
          ))}
        </ul>
      )}
      {search.length >= 3 && filtered.length === 0 && (
        <div className="text-sm text-gray-500 px-2">No matching products</div>
      )}
    </div>
  )
}
