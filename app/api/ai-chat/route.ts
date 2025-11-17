import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/text-bison-001'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta2/${GEMINI_MODEL}:generateText`

// Chuẩn hóa tin nhắn: lowercase, loại dấu, trim
function normalizeMessage(message: string): string {
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // loại dấu
    .trim()
}

// Map keyword sang category
const categoryMap: Record<string, string> = {
  'đồ điện tử': 'Đồ điện tử',
  'dien tu': 'Đồ điện tử',
  'quần áo': 'Quần áo',
  'quan ao': 'Quần áo',
  'áo quần': 'Quần áo',
  'ao quan': 'Quần áo',
  'đồ gia dụng': 'Đồ gia dụng',
  'do gia dung': 'Đồ gia dụng',
  'gia dụng': 'Đồ gia dụng',
  'gia dung': 'Đồ gia dụng',
  'sách': 'Sách',
  'do choi': 'Đồ chơi',
  'đồ chơi': 'Đồ chơi',
  'noi that': 'Nội thất',
  'nội thất': 'Nội thất',
}

function extractCategory(message: string): string | null {
  for (const key in categoryMap) {
    if (message.includes(key)) return categoryMap[key]
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = body

    if (!message) {
      return NextResponse.json({ error: 'Thiếu tin nhắn' }, { status: 400 })
    }

    const userMessage = normalizeMessage(message)
    let response = ''

    // Nếu có GEMINI API key, gọi Gemini (Google Generative Language API) trước
    if (GEMINI_API_KEY) {
      try {
        const systemPrompt = `Bạn là trợ lý AI cho ứng dụng Đổi đồ cũ tại Việt Nam. Trả lời bằng tiếng Việt, ngắn gọn, hữu ích, ưu tiên hướng dẫn về đăng đồ, tìm kiếm, đổi đồ, QR code, và đánh giá.`
        const payload = {
          prompt: { text: `${systemPrompt}\nUser: ${message}` },
          temperature: 0.7,
          maxOutputTokens: 700,
        }

        const resp = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (resp.ok) {
          const data = await resp.json()
          // Try several possible response shapes from different Gemini/GLA versions
          const aiText =
            data?.candidates?.[0]?.output ||
            data?.candidates?.[0]?.content ||
            data?.candidates?.[0]?.content?.text ||
            data?.candidates?.[0]?.text ||
            data?.output?.[0]?.content ||
            data?.result ||
            null

          if (aiText) {
            // normalize to string
            const aiMessage = typeof aiText === 'string' ? aiText : JSON.stringify(aiText)
            return NextResponse.json({ response: aiMessage, intent: 'ai', source: 'gemini' })
          }
        } else {
          const errText = await resp.text()
          console.error('Gemini API error:', resp.status, errText)
        }
      } catch (err) {
        console.error('Gemini call failed:', err)
      }
    }

    // Greeting
    if (userMessage.includes('xin chao') || userMessage.includes('hello') || userMessage.includes('chao')) {
      response = `Xin chào! Tôi là trợ lý AI của ứng dụng Đổi đồ cũ. Tôi có thể giúp bạn:
• Tìm đồ theo danh mục
• Tư vấn về cách đăng đồ
• Hướng dẫn sử dụng ứng dụng
• Trả lời câu hỏi về giao dịch

Bạn cần hỗ trợ gì?`
    }
    // Help
    else if (userMessage.includes('giup') || userMessage.includes('help') || userMessage.includes('huong dan')) {
      response = `Tôi có thể giúp bạn:
1. **Tìm đồ**: Hãy nói "tìm đồ điện tử" hoặc "tìm quần áo"
2. **Đăng đồ**: Vào trang "Đăng đồ" và điền thông tin
3. **Giao dịch**: Đổi đồ, Tặng miễn phí, Bán giá rẻ
4. **Chat**: Nhắn tin trực tiếp với người bán
5. **QR Code**: Mỗi đồ có QR code để quét và xác nhận

Bạn muốn biết thêm về điều gì?`
    }
    // Search items
    else if (userMessage.includes('tim') || userMessage.includes('search') || userMessage.includes('co do')) {
      const category = extractCategory(userMessage)
      if (category) {
        // Lấy 5 item mới nhất trong category
        const items = await prisma.item.findMany({
          where: { category: { contains: category }, status: 'available' },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, city: true } } },
        })

        if (items.length > 0) {
          response = `Tôi tìm thấy ${items.length} đồ trong danh mục "${category}":\n`
          items.forEach((item, index) => {
            const userName = item.user?.name || 'Người dùng ẩn danh'
            const userCity = item.user?.city ? ` (${item.user.city})` : ''
            response += `${index + 1}. ${item.title} - ${item.condition}\n`
            response += `   Người đăng: ${userName}${userCity}\n`
            response += `   Xem tại: /items/${item.id}\n\n`
          })
          response += 'Bạn có thể xem chi tiết bằng cách click vào link hoặc tìm kiếm trên trang "Tất cả đồ".'
        } else {
          response = `Hiện chưa có đồ nào trong danh mục "${category}". Bạn có thể đăng đồ đầu tiên!`
        }
      } else {
        response = `Bạn muốn tìm đồ gì? Hãy nói rõ danh mục như:
• Đồ điện tử
• Quần áo
• Đồ gia dụng
• Sách
• Đồ chơi
• Nội thất`
      }
    }
    // Transaction types
    else if (userMessage.includes('doi') || userMessage.includes('tang') || userMessage.includes('ban')) {
      response = `Ứng dụng hỗ trợ 3 hình thức giao dịch:
1. **Đổi đồ**: Trao đổi đồ 1-1 với người khác
2. **Tặng miễn phí**: Cho đồ miễn phí cho người cần
3. **Bán giá rẻ**: Bán đồ với giá hợp lý

Khi đăng đồ, bạn chọn hình thức phù hợp. Sau đó người khác có thể liên hệ qua chat hoặc yêu cầu giao dịch.`
    }
    // QR Code
    else if (userMessage.includes('qr') || userMessage.includes('ma')) {
      response = `QR Code giúp bạn:
• Mỗi đồ có một QR code duy nhất
• Quét QR để xem thông tin nhanh
• Xác nhận giao dịch trực tiếp
• Lưu lịch sử giao dịch tự động

Bạn có thể xem QR code trong trang chi tiết.`
    }
    // Reviews
    else if (userMessage.includes('danh gia') || userMessage.includes('uy tin') || userMessage.includes('review')) {
      response = `Hệ thống đánh giá giúp:
• Đánh giá người dùng sau giao dịch (1-5 sao)
• Tính điểm uy tín tự động
• Hiển thị trong hồ sơ người dùng
• Giúp người khác tin tưởng hơn

Sau khi hoàn thành giao dịch, bạn có thể đánh giá đối tác.`
    }
    // Default fallback
    else {
      response = `Tôi hiểu bạn đang hỏi về: "${message}"

Tôi có thể giúp bạn:
• Tìm đồ theo danh mục
• Hướng dẫn sử dụng ứng dụng
• Giải thích các tính năng
• Tư vấn về giao dịch

Hãy thử hỏi: "tìm đồ điện tử" hoặc "hướng dẫn đăng đồ"`
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra', response: 'Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
