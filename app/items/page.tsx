'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

interface Item {
  id: string
  title: string
  description: string
  category: string
  condition: string
  image: string | null
  createdAt: Date
  user: {
    name: string
    address: string | null
  }
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [city, setCity] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'Đồ điện tử',
    'Quần áo',
    'Đồ gia dụng',
    'Sách',
    'Đồ chơi',
    'Nội thất',
    'Khác',
  ]

  const conditions = ['Mới', 'Còn tốt', 'Đã qua sử dụng']

  useEffect(() => {
    fetchItems()
  }, [category, condition, search, city, transactionType, sortBy])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (condition) params.append('condition', condition)
      if (search) params.append('search', search)
      if (city) params.append('city', city)
      if (transactionType) params.append('transactionType', transactionType)

      const response = await fetch(`/api/items?${params.toString()}`)
      let data = await response.json()
      
      // Sort items
      if (sortBy === 'newest') {
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (sortBy === 'oldest') {
        data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      } else if (sortBy === 'views') {
        data.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      } else if (sortBy === 'price-low') {
        data = data.filter((item: any) => item.price).sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
      } else if (sortBy === 'price-high') {
        data = data.filter((item: any) => item.price).sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
      }
      
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems()
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setCondition('')
    setCity('')
    setTransactionType('')
    setSortBy('newest')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Tất cả đồ</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Lọc</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm đồ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </form>

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tình trạng
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành phố
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Hà Nội, TP.HCM..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình thức
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả</option>
                <option value="exchange">Đổi đồ</option>
                <option value="gift">Tặng miễn phí</option>
                <option value="sell">Bán giá rẻ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="views">Nhiều lượt xem</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">
            Không tìm thấy đồ nào phù hợp với bộ lọc của bạn.
          </p>
        </div>
      )}
    </div>
  )
}

