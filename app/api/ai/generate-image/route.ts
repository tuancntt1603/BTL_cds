import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style, size = '1024x1024' } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập mô tả ảnh' },
        { status: 400 }
      )
    }

    // Tạo image ID unique
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Trong production, bạn có thể tích hợp với:
    // 1. OpenAI DALL-E API
    // 2. Stable Diffusion API
    // 3. Midjourney API
    // 4. Replicate API
    // 5. Hugging Face API
    
    // Mock response - trong production sẽ là ảnh thật từ AI
    const imageUrl = await generateImageMock(prompt, style, size, imageId)

    return NextResponse.json({
      imageId,
      imageUrl,
      prompt,
      style: style || 'realistic',
      size,
      message: 'Ảnh đã được tạo thành công',
      status: 'completed',
    })
  } catch (error: any) {
    console.error('Generate image error:', error)
    const msg = error?.message || String(error)
    if (/quota|rate|429|RESOURCE_EXHAUSTED|UNAVAILABLE|overloaded|capacity/i.test(msg)) {
      return NextResponse.json(
        { error: 'Hệ thống AI đang quá tải hoặc vượt hạn mức. Vui lòng thử lại sau.' },
        { status: 429 }
      )
    }
    return NextResponse.json(
      { error: 'Lỗi khi tạo ảnh' },
      { status: 500 }
    )
  }
}

// Mock function - thay thế bằng logic thật
async function generateImageMock(
  prompt: string,
  style: string,
  size: string,
  imageId: string
): Promise<string> {
  // Trong production, đây sẽ là:
  // 1. Gọi AI API (OpenAI, Stable Diffusion, etc.)
  // 2. Download ảnh
  // 3. Upload lên storage
  // 4. Return image URL
  
  // Ví dụ với OpenAI DALL-E:
  /*
  const openai = require('openai')
  const openaiClient = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  
  const response = await openaiClient.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    size: size,
    quality: 'standard',
    n: 1,
  })
  
  const imageUrl = response.data[0].url
  
  // Download và upload to storage
  const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer())
  const uploadedUrl = await uploadToStorage(Buffer.from(imageBuffer), imageId)
  
  return uploadedUrl
  */
  
  // Ví dụ với Replicate (Stable Diffusion):
  /*
  const replicate = require('replicate')
  const replicateClient = new replicate.Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })
  
  const output = await replicateClient.run(
    'stability-ai/stable-diffusion:...',
    {
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
      },
    }
  )
  
  return output[0] // URL của ảnh
  */
  
  // Placeholder - trả về ảnh demo từ Unsplash
  // Trong production, đây sẽ là URL ảnh thật từ AI
  const searchTerms = [
    'product',
    'item',
    'object',
    'goods',
    'merchandise',
  ]
  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
  const [width, height] = size.split('x')
  
  // Sử dụng Unsplash API với random image
  return `https://picsum.photos/${width}/${height}?random=${Date.now()}`
}

// Function để check status của image generation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Thiếu imageId' },
        { status: 400 }
      )
    }

    // Check status từ database hoặc queue
    // Mock response
    return NextResponse.json({
      imageId,
      status: 'completed',
      imageUrl: `https://source.unsplash.com/1024x1024/?product`,
      progress: 100,
    })
  } catch (error) {
    console.error('Check image status error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi kiểm tra trạng thái' },
      { status: 500 }
    )
  }
}

