import Link from 'next/link'
import { Recycle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="w-6 h-6" />
              <span className="text-xl font-bold">Đổi đồ cũ</span>
            </div>
            <p className="text-gray-400">
              Ứng dụng trao đổi đồ cũ, tái sử dụng và bảo vệ môi trường
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/items" className="hover:text-white">
                  Tất cả đồ
                </Link>
              </li>
              <li>
                <Link href="/items/new" className="hover:text-white">
                  Đăng đồ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-gray-400">
              Chúng tôi tin rằng việc tái sử dụng đồ cũ không chỉ giúp tiết kiệm
              chi phí mà còn góp phần bảo vệ môi trường.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Đổi đồ cũ. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}












