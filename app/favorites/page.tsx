'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ItemCard from '@/components/ItemCard'

export default function FavoritesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)
    fetchFavorites(userData.id)
  }, [router])

  const fetchFavorites = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)
      const data = await response.json()
      setFavorites(data.map((fav: any) => fav.item))
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Đồ yêu thích</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">
            Bạn chưa yêu thích đồ nào.
          </p>
        </div>
      )}
    </div>
  )
}












