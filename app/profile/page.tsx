'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, Package, Heart } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [myItems, setMyItems] = useState<any[]>([])
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
      const response = await fetch('/api/items')
      const data = await response.json()
      const filtered = data.filter((item: any) => item.userId === userId)
      setMyItems(filtered)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <div className="flex-grow space-y-3">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
            </div>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Link
          href="/items/my-items"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Đồ của tôi</h3>
          <p className="text-gray-600 text-sm">Quản lý đồ đã đăng</p>
        </Link>
        <Link
          href="/favorites"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Yêu thích</h3>
          <p className="text-gray-600 text-sm">Xem đồ đã yêu thích</p>
        </Link>
        <Link
          href="/transactions"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Giao dịch</h3>
          <p className="text-gray-600 text-sm">Lịch sử giao dịch</p>
        </Link>
        <Link
          href="/chat"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Tin nhắn</h3>
          <p className="text-gray-600 text-sm">Xem tin nhắn</p>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Đồ của tôi</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : myItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">
              Bạn chưa đăng đồ nào. Hãy đăng đồ đầu tiên!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

