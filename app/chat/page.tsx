'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // -----------------------------------------------------
  // Load user first → then fetch conversations
  // -----------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }

    const userObj = JSON.parse(storedUser)
    setUser(userObj)
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    }
  }, [user])

  // -----------------------------------------------------
  // Fetch messages repeatedly
  // -----------------------------------------------------
  useEffect(() => {
    if (!selectedConversation) return

    fetchMessages(selectedConversation)

    const interval = setInterval(() => {
      fetchMessages(selectedConversation)
    }, 2000)

    return () => clearInterval(interval)
  }, [selectedConversation])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // -----------------------------------------------------
  const fetchConversations = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/messages?userId=${user.id}`)
      const data = await response.json()

      const conversationMap = new Map()

      data.forEach((msg: any) => {
        const isCurrentUserSender = msg.senderId === user.id
        const otherId = isCurrentUserSender ? msg.receiverId : msg.senderId
        const otherUser = isCurrentUserSender ? msg.receiver : msg.sender

        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, {
            userId: otherId,
            user: otherUser,
            lastMessage: msg,
            unread: msg.receiverId === user.id && !msg.isRead ? 1 : 0,
          })
        } else {
          const conv = conversationMap.get(otherId)

          // update last message
          if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
            conv.lastMessage = msg
          }

          // count unread
          if (msg.receiverId === user.id && !msg.isRead) {
            conv.unread++
          }
        }
      })

      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchMessages = async (otherUserId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(
        `/api/messages?userId=${user.id}&otherUserId=${otherUserId}`
      )
      const data = await response.json()
      setMessages(data)

      // mark as read
      await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, otherUserId }),
      })

      fetchConversations()
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !imageUrl.trim()) return
    if (!selectedConversation) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConversation,
          content: newMessage || '',
          image: imageUrl || null,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        setImageUrl('')
        fetchMessages(selectedConversation)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!user) return null

  const selectedConv = conversations.find(c => c.userId === selectedConversation)

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex">
      {/* Conversations */}
      <div className="w-1/3 border-r bg-white rounded-l-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Tin nhắn</h2>
        </div>

        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedConversation(conv.userId)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                  selectedConversation === conv.userId ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{conv.user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {(conv.lastMessage?.content || '[Hình ảnh]').substring(0, 30)}
                    </p>
                  </div>

                  {conv.unread > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-white rounded-r-xl">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={() => setSelectedConversation(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold">{selectedConv?.user?.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === user.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.image && (
                      <Image
                        src={msg.image}
                        alt="image"
                        width={200}
                        height={200}
                        className="rounded mb-2"
                        unoptimized
                      />
                    )}

                    {msg.content && <p>{msg.content}</p>}

                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Link hình ảnh (tùy chọn)"
                className="flex-1 px-4 py-2 border rounded-lg"
              />

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />

              <button
                onClick={sendMessage}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  )
}
