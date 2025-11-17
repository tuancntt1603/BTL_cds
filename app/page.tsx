import Link from 'next/link'
import { Search, ArrowRight, Recycle, Heart, Users } from 'lucide-react'
import ItemCard from '@/components/ItemCard'
import { prisma } from '@/lib/prisma'

async function getItems() {
  try {
    const items = await prisma.item.findMany({
      where: { status: 'available' },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
    return items
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const items = await getItems()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Đổi đồ cũ – Tái sử dụng
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Trao đổi đồ cũ, bảo vệ môi trường, tiết kiệm chi phí
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/items/new"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Đăng đồ cần đổi
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/items"
            className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Tìm đồ cần
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Recycle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tái sử dụng</h3>
          <p className="text-gray-600">
            Giảm thiểu rác thải, bảo vệ môi trường bằng cách tái sử dụng đồ cũ
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tiết kiệm</h3>
          <p className="text-gray-600">
            Tiết kiệm chi phí bằng cách trao đổi đồ cũ thay vì mua mới
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Cộng đồng</h3>
          <p className="text-gray-600">
            Kết nối với cộng đồng, chia sẻ và trao đổi đồ dùng
          </p>
        </div>
      </section>

      {/* Recent Items */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Đồ mới đăng</h2>
          <Link
            href="/items"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">
              Chưa có đồ nào được đăng. Hãy là người đầu tiên!
            </p>
            <Link
              href="/items/new"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Đăng đồ ngay →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}












