'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Recycle, User, LogOut, LogIn, Heart, MessageCircle, Sparkles, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import NotificationBell from './NotificationBell'

export default function Header() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
      const userData = JSON.parse(user)
      setUserName(userData.name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-600">
              Đổi đồ cũ
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/items"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/items')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tất cả đồ
            </Link>
            <Link
              href="/items/new"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/items/new')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Đăng đồ
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/items/my-items"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/items/my-items')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Đồ của tôi
                </Link>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/ai-chat"
              className="p-2 text-gray-700 hover:text-primary-600"
              title="Chat với AI"
            >
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link
              href="/ai-image"
              className="p-2 text-gray-700 hover:text-primary-600"
              title="AI Tạo Ảnh"
            >
              <ImageIcon className="w-5 h-5" />
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/favorites"
                  className="p-2 text-gray-700 hover:text-primary-600"
                  title="Yêu thích"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  href="/chat"
                  className="p-2 text-gray-700 hover:text-primary-600"
                  title="Tin nhắn"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <NotificationBell />
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

