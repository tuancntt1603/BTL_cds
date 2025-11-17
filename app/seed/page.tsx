'use client'

import { useState } from 'react'
import { Database, Loader } from 'lucide-react'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSeed = async () => {
    if (!confirm('Bạn có chắc muốn tạo dữ liệu mẫu? Điều này sẽ tạo 3 người dùng và 10 đồ mẫu.')) {
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error seeding:', error)
      setError('Có lỗi xảy ra khi tạo dữ liệu mẫu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold">Tạo dữ liệu mẫu</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Tính năng này sẽ tạo dữ liệu mẫu cho ứng dụng, bao gồm:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>3 người dùng mẫu (user1@example.com, user2@example.com, user3@example.com)</li>
          <li>10 đồ mẫu với các hình thức: Đổi đồ, Tặng miễn phí, Bán giá rẻ</li>
          <li>Mật khẩu cho tất cả user: <strong>123456</strong></li>
        </ul>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold mb-2">{result.message}</p>
            {result.users && (
              <div className="mt-2">
                <p className="font-semibold">Thông tin đăng nhập:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {Object.entries(result.users).map(([key, user]: [string, any]) => (
                    <li key={key}>
                      Email: <strong>{user.email}</strong> | Password: <strong>{user.password}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Đang tạo dữ liệu...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Tạo dữ liệu mẫu</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Lưu ý: Nếu đồ đã tồn tại (cùng title và userId), sẽ không tạo lại để tránh trùng lặp.
        </p>
      </div>
    </div>
  )
}









