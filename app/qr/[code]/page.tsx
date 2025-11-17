'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

export default function QRCodePage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQRData()
  }, [params.code])

  const fetchQRData = async () => {
    try {
      const response = await fetch(`/api/qr/${params.code}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        alert('QR code không hợp lệ')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching QR data:', error)
      alert('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy thông tin</p>
      </div>
    )
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

      {data.type === 'item' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Thông tin đồ</h1>
          <ItemCard item={data.data} />
          <div className="mt-4">
            <Link
              href={`/items/${data.data.id}`}
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      )}

      {data.type === 'transaction' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Thông tin giao dịch</h1>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Đồ:</p>
              <p>{data.data.item.title}</p>
            </div>
            <div>
              <p className="font-semibold">Người mua:</p>
              <p>{data.data.buyer.name}</p>
            </div>
            <div>
              <p className="font-semibold">Trạng thái:</p>
              <p>{data.data.status}</p>
            </div>
            {data.data.qrCode && (
              <div>
                <p className="font-semibold">QR Code:</p>
                <p className="font-mono text-sm">{data.data.qrCode}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}












