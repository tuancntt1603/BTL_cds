'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Heart } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'

interface ItemCardProps {
  item: {
    id: string
    title: string
    description: string
    category: string
    condition: string
    image?: string | null
    images?: string | null
    transactionType?: string
    price?: number | null
    createdAt: Date
    user: {
      name: string
      address: string | null
      city?: string | null
    }
  }
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      checkFavorite(parsedUser.id)
    }
  }, [])

  const checkFavorite = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)
      const data = await response.json()
      const favoriteIds = data.map((fav: any) => fav.itemId)
      setIsFavorite(favoriteIds.includes(item.id))
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return alert('Vui lòng đăng nhập để yêu thích đồ')

    try {
      if (isFavorite) {
        await fetch(`/api/favorites?userId=${user.id}&itemId=${item.id}`, { method: 'DELETE' })
        setIsFavorite(false)
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, itemId: item.id }),
        })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const formattedDate = useMemo(
    () =>
      new Date(item.createdAt).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [item.createdAt]
  )

  const conditionColors: Record<string, string> = {
    Mới: 'bg-green-100 text-green-800',
    'Còn tốt': 'bg-blue-100 text-blue-800',
    'Đã qua sử dụng': 'bg-yellow-100 text-yellow-800',
  }

  const firstImage = useMemo(() => {
    if (item.image) return item.image
    if (item.images) {
      try {
        const imgs = JSON.parse(item.images)
        return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null
      } catch {
        return null
      }
    }
    return null
  }, [item.image, item.images])

  const transactionTypeLabels: Record<string, string> = {
    exchange: 'Đổi đồ',
    gift: 'Tặng miễn phí',
    sell: 'Bán',
  }

  return (
    <Link href={`/items/${item.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
          } transition-colors`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="relative h-48 bg-gray-200">
          {firstImage ? (
            <Image src={firstImage} alt={item.title} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>Không có hình ảnh</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                conditionColors[item.condition] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.condition}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{item.user.address || 'Chưa có địa chỉ'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-primary-600 font-medium">{item.category}</span>
            {item.transactionType && (
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                {transactionTypeLabels[item.transactionType] || item.transactionType}
              </span>
            )}
            {item.price != null && (
              <span className="text-xs font-semibold text-green-600">
                {item.price.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
