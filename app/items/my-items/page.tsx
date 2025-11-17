'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

export default function MyItemsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)
    fetchMyItems(userData.id)
  }, [router])

  const fetchMyItems = async (userId: string) => {
    try {
      const response = await fetch(`/api/items/my-items?userId=${userId}`)
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đồ này?')) return

    try {
      const response = await fetch(`/api/items/${itemId}?userId=${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Xóa thành công!')
        fetchMyItems(user.id)
      } else {
        const data = await response.json()
        alert(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Có lỗi xảy ra')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Quản lý đồ đã đăng</h1>
        </div>
        <Link
          href="/items/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Đăng đồ mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <ItemCard item={item} />
              <div className="p-4 border-t flex gap-2">
                <Link
                  href={`/items/${item.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Sửa</span>
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
                <Link
                  href={`/items/${item.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">
            Bạn chưa đăng đồ nào.
          </p>
          <Link
            href="/items/new"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Đăng đồ ngay
          </Link>
        </div>
      )}
    </div>
  )
}












