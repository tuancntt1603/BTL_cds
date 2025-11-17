'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowLeft, MessageCircle, Star } from 'lucide-react'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import VideoGenerator from '@/components/VideoGenerator'

interface Item {
  id: string
  title: string
  description: string
  category: string
  condition: string
  images: string | null
  transactionType: string
  price: number | null
  qrCode: string | null
  status: string
  views: number
  createdAt: Date
  user: {
    id: string
    name: string
    address: string | null
    phone: string | null
    email: string
    city: string | null
    reputation: number
    totalReviews: number
  }
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchItem()
  }, [])

  useEffect(() => {
    if (item) {
      fetchReviews()
    }
  }, [item])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setItem(data)
      }
    } catch (error) {
      console.error('Error fetching item:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    if (!item) return
    try {
      const response = await fetch(`/api/reviews?userId=${item.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleTransaction = async (type: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (item?.user.id === user.id) {
      alert('Bạn không thể thực hiện giao dịch với đồ của chính mình')
      return
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item?.id,
          buyerId: user.id,
          transactionType: type,
        }),
      })

      if (response.ok) {
        alert(`Yêu cầu ${type === 'exchange' ? 'đổi đồ' : type === 'gift' ? 'nhận tặng' : 'mua'} đã được gửi thành công!`)
      } else {
        const data = await response.json()
        alert(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Có lỗi xảy ra')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy đồ</p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const conditionColors: Record<string, string> = {
    Mới: 'bg-green-100 text-green-800',
    'Còn tốt': 'bg-blue-100 text-blue-800',
    'Đã qua sử dụng': 'bg-yellow-100 text-yellow-800',
  }

  const transactionTypeLabels: Record<string, string> = {
    exchange: 'Đổi đồ',
    gift: 'Tặng miễn phí',
    sell: 'Bán',
  }

  const images = item.images ? (() => {
    try {
      const parsed = JSON.parse(item.images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })() : []

  const getMainImage = () => {
    return images.length > 0 ? images[selectedImageIndex] : null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 space-y-2">
            <div className="relative h-64 md:h-96 bg-gray-200">
              {getMainImage() ? (
                <Image
                  src={getMainImage()}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span>Không có hình ảnh</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded border-2 ${
                      selectedImageIndex === index
                        ? 'border-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6 space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    conditionColors[item.condition] ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.condition}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-primary-600 font-medium">{item.category}</p>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {transactionTypeLabels[item.transactionType]}
                </span>
                {item.price && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-lg font-semibold text-green-600">
                      {item.price.toLocaleString('vi-VN')} đ
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <span>{item.views} lượt xem</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Mô tả</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {item.qrCode && (
              <QRCodeDisplay qrCode={item.qrCode} itemTitle={item.title} />
            )}

            {item.status === 'available' && user && item.user.id !== user.id && (
              <div className="space-y-2 pt-4 border-t">
                {item.transactionType === 'exchange' && (
                  <button
                    onClick={() => handleTransaction('exchange')}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Yêu cầu đổi đồ
                  </button>
                )}
                {item.transactionType === 'gift' && (
                  <button
                    onClick={() => handleTransaction('gift')}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Nhận tặng miễn phí
                  </button>
                )}
                {item.transactionType === 'sell' && (
                  <button
                    onClick={() => handleTransaction('sell')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Mua ngay
                  </button>
                )}
                <Link
                  href={`/chat/${item.user.id}`}
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Nhắn tin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Thông tin người đăng</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.user.name}</span>
              {item.user.reputation > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">
                    {item.user.reputation.toFixed(1)} ({item.user.totalReviews} đánh giá)
                  </span>
                </div>
              )}
            </div>
          </div>
          {item.user.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <span>{item.user.address}</span>
              {item.user.city && <span className="text-gray-500">, {item.user.city}</span>}
            </div>
          )}
          {item.user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{item.user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{item.user.email}</span>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.reviewer.name}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Video Generator */}
      {images.length > 0 && (
        <VideoGenerator
          {...({
            itemId: item.id,
            itemTitle: item.title,
            itemDescription: item.description,
            onVideoGenerated: (videoUrl: string) => {
              console.log('Video generated for item:', item.id, videoUrl)
              // Có thể lưu video URL vào database nếu cần
            },
          } as any)}
        />
      )}
    </div>
  )
}
