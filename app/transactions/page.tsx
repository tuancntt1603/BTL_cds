'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mapping trạng thái
  const statusMap: Record<string, { label: string; color: string; Icon: any }> = {
    pending: { label: 'Chờ xử lý', color: 'yellow-500', Icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'blue-500', Icon: CheckCircle },
    completed: { label: 'Hoàn thành', color: 'green-500', Icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'red-500', Icon: XCircle },
  }

  const typeMap: Record<string, string> = {
    exchange: 'Đổi đồ',
    gift: 'Tặng miễn phí',
    sell: 'Bán',
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)
    fetchTransactions(userData.id)

    // Polling tự động mỗi 5 giây
    const interval = setInterval(() => fetchTransactions(userData.id), 5000)
    return () => clearInterval(interval)
  }, [router])

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`)
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>

      {loading ? (
        // Skeleton loader
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const status = statusMap[transaction.status] || {
              label: transaction.status,
              color: 'gray-500',
              Icon: Clock,
            }
            return (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {transaction.item?.title || 'Không có tên'}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Loại:</span>{' '}
                      {typeMap[transaction.transactionType] || 'Bán'}
                    </p>
                    <p>
                      <span className="font-medium">Người mua:</span>{' '}
                      {transaction.buyer?.name || 'Chưa có'}
                    </p>
                    <p>
                      <span className="font-medium">Ngày tạo:</span>{' '}
                      {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                    </p>
                    {transaction.confirmedAt && (
                      <p>
                        <span className="font-medium">Ngày xác nhận:</span>{' '}
                        {new Date(transaction.confirmedAt).toLocaleString(
                          'vi-VN'
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <status.Icon
                    className={`w-5 h-5 text-${status.color}`}
                  />
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">Bạn chưa có giao dịch nào.</p>
        </div>
      )}
    </div>
  )
}

