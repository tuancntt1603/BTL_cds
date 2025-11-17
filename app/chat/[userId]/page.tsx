'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function ChatWithUserPage() {
  const router = useRouter()
  const params = useParams()

  const [user, setUser] = useState<any>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // track if user is at (or near) bottom
  const [isAtBottom, setIsAtBottom] = useState(true)
  const isAtBottomRef = useRef(true) // mirror for callbacks

  // ----------------------------
  // 1. Load user
  // ----------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [])

  // ----------------------------
  // 2. Attach scroll listener to update isAtBottom
  // ----------------------------
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      // distance from bottom
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight
      const atBottom = distanceFromBottom < 80 // px threshold
      isAtBottomRef.current = atBottom
      setIsAtBottom(atBottom)
    }

    // listen
    el.addEventListener('scroll', onScroll, { passive: true })

    // initial check (in case content already fills)
    onScroll()

    return () => {
      el.removeEventListener('scroll', onScroll)
    }
  }, [containerRef.current, messages.length])

  // ----------------------------
  // 3. Fetch messages when user loaded
  // ----------------------------
  useEffect(() => {
    if (!user) return

    fetchMessages() // initial
    const interval = setInterval(fetchMessages, 2000)

    return () => clearInterval(interval)
  }, [user, params.userId])

  // ----------------------------
  // 4. Auto-scroll only when user is at bottom
  // ----------------------------
  useEffect(() => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    // if user is not at bottom -> do nothing (so user can read old messages)
  }, [messages])

  // ----------------------------
  // Fetch messages
  // ----------------------------
  const fetchMessages = async () => {
    if (!user) return
    try {
      const res = await fetch(
        `/api/messages?userId=${user.id}&otherUserId=${params.userId}`
      )
      const data = await res.json()
      // keep type safety
      const arr = Array.isArray(data) ? data : []
      // simple optimization: only update state if different length or last id differs
      const lastOldId = messages.length ? messages[messages.length - 1]?.id : null
      const lastNewId = arr.length ? arr[arr.length - 1]?.id : null

      if (arr.length !== messages.length || lastOldId !== lastNewId) {
        setMessages(arr)
      }

      if (arr.length > 0) {
        const firstMsg = arr[0]
        const other =
          firstMsg.senderId === user.id ? firstMsg.receiver : firstMsg.sender
        setOtherUser(other || null)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  // ----------------------------
  // Send message
  // ----------------------------
  const sendMessage = async () => {
    if (!newMessage.trim() && !imageUrl.trim()) return
    if (!user) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: params.userId,
          content: newMessage,
          image: imageUrl || null,
        }),
      })

      if (res.ok) {
        setNewMessage('')
        setImageUrl('')
        // fetch new messages
        await fetchMessages()
        // only scroll if user was at bottom
        if (isAtBottomRef.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        console.error('Send message failed', await res.text())
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-xl shadow-md">
      {/* header */}
      <div className="p-4 border-b flex items-center gap-4">
        <Link href="/chat">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="font-semibold">{otherUser?.name || 'Đang tải...'}</h3>
      </div>

      {/* messages container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        // optional: make keyboard scrolling smoother on mobile
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.senderId === user.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.image && (
                <div className="mb-2">
                  <Image
                    src={msg.image}
                    alt="Message image"
                    width={200}
                    height={200}
                    className="rounded"
                    unoptimized
                  />
                </div>
              )}

              <p>{msg.content}</p>

              <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-primary-100' : 'text-gray-600'}`}>
                {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Link hình ảnh (tùy chọn)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          <button
            onClick={sendMessage}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {/* small hint */}
        <div className="mt-2 text-xs text-gray-500">
          {isAtBottom ? 'Bạn đang ở cuối cuộc trò chuyện' : 'Bạn đang ở trên — không tự cuộn khi có tin mới'}
        </div>
      </div>
    </div>
  )
}
