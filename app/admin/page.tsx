'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Package, MessageCircle, TrendingUp, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalMessages: 0,
    totalTransactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)
    
    // Check if user is admin (in real app, check from database)
    // For now, we'll allow any logged-in user to see basic stats
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      // In a real app, you'd have admin API endpoints
      // For now, we'll just show placeholder stats
      setStats({
        totalUsers: 0,
        totalItems: 0,
        totalMessages: 0,
        totalTransactions: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tổng người dùng</p>
                  <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tổng đồ đăng</p>
                  <p className="text-2xl font-bold mt-2">{stats.totalItems}</p>
                </div>
                <Package className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tin nhắn</p>
                  <p className="text-2xl font-bold mt-2">{stats.totalMessages}</p>
                </div>
                <MessageCircle className="w-12 h-12 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Giao dịch</p>
                  <p className="text-2xl font-bold mt-2">{stats.totalTransactions}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quản lý hệ thống</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Tính năng admin đang được phát triển. Trong phiên bản tương lai, bạn sẽ có thể:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Duyệt bài đăng</li>
                <li>Quản lý người dùng</li>
                <li>Xem thống kê chi tiết</li>
                <li>Cảnh báo hoặc khóa tài khoản vi phạm</li>
                <li>Theo dõi giao dịch theo ngày/tháng</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}












