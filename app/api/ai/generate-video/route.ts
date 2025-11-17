import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images, title, description, itemId } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Cần ít nhất 1 hình ảnh' },
        { status: 400 }
      )
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: 'Tối đa 3 hình ảnh' },
        { status: 400 }
      )
    }

    // Tạo video ID unique
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Trong production, bạn có thể:
    // 1. Sử dụng FFmpeg để tạo video từ ảnh
    // 2. Sử dụng Remotion (React-based video generation)
    // 3. Sử dụng API như RunwayML, Synthesia, hoặc các service khác
    // 4. Sử dụng cloud functions (AWS Lambda, Google Cloud Functions)
    
    // Hiện tại, tạo một video URL placeholder
    // Trong thực tế, bạn cần xử lý:
    // - Download ảnh từ URLs
    // - Tạo video với FFmpeg hoặc service khác
    // - Thêm nhạc nền
    // - Thêm text overlay
    // - Thêm transitions
    // - Upload video lên storage (S3, Cloudinary, etc.)
    
    // Mock response - trong production sẽ là video URL thật
    const videoUrl = await generateVideoMock(images, title, description, videoId)

    return NextResponse.json({
      videoId,
      videoUrl,
      duration: 12, // 10-15 giây
      message: 'Video đang được tạo. Vui lòng đợi...',
      status: 'processing', // processing, completed, failed
    })
  } catch (error: any) {
    console.error('Generate video error:', error)
    const msg = error?.message || String(error)
    if (/quota|rate|429|RESOURCE_EXHAUSTED|UNAVAILABLE|overloaded|capacity/i.test(msg)) {
      return NextResponse.json(
        { error: 'Hệ thống AI đang quá tải hoặc vượt hạn mức. Vui lòng thử lại sau.' },
        { status: 429 }
      )
    }
    return NextResponse.json(
      { error: 'Lỗi khi tạo video' },
      { status: 500 }
    )
  }
}

// Mock function - thay thế bằng logic thật
async function generateVideoMock(
  images: string[],
  title: string,
  description: string,
  videoId: string
): Promise<string> {
  // Trong production, đây sẽ là:
  // 1. Download images
  // 2. Process với FFmpeg hoặc service
  // 3. Upload video lên storage
  // 4. Return video URL
  
  // Ví dụ với FFmpeg (cần cài đặt ffmpeg):
  /*
  const ffmpeg = require('fluent-ffmpeg')
  const path = require('path')
  const fs = require('fs')
  
  // Tạo video từ ảnh
  return new Promise((resolve, reject) => {
    const outputPath = path.join('/tmp', `${videoId}.mp4`)
    
    ffmpeg()
      .input(images[0])
      .inputOptions(['-loop', '1', '-t', '4'])
      .videoFilters([
        'scale=1280:720',
        'fps=30',
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-shortest',
      ])
      .output(outputPath)
      .on('end', () => {
        // Upload to storage
        resolve(uploadToStorage(outputPath))
      })
      .on('error', reject)
      .run()
  })
  */
  
  // Placeholder - trả về một video demo URL
  // Trong production, đây sẽ là URL video thật từ storage
  return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
}

// Function để check status của video generation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json(
        { error: 'Thiếu videoId' },
        { status: 400 }
      )
    }

    // Check status từ database hoặc queue
    // Mock response
    return NextResponse.json({
      videoId,
      status: 'completed',
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      progress: 100,
    })
  } catch (error) {
    console.error('Check video status error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi kiểm tra trạng thái' },
      { status: 500 }
    )
  }
}









