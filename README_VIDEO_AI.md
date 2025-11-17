# AI Tạo Video Giới Thiệu Sản Phẩm

## Tính năng

Tính năng AI tự động tạo video giới thiệu sản phẩm từ 1-3 hình ảnh với:
- ✅ Hiệu ứng chuyển cảnh mượt mà
- ✅ Nhạc nền tự động
- ✅ Chữ chạy mô tả sản phẩm
- ✅ Video 10-15 giây
- ✅ Tăng tính chuyên nghiệp cho sản phẩm

## Cách sử dụng

1. **Khi đăng đồ mới:**
   - Thêm ít nhất 1 hình ảnh
   - Component VideoGenerator sẽ xuất hiện tự động
   - Upload 1-3 ảnh vào VideoGenerator
   - Nhấn "AI Tạo Video"
   - Đợi video được tạo (10-30 giây)
   - Tải video về hoặc sử dụng

2. **Trên trang chi tiết đồ:**
   - Nếu đồ có hình ảnh, VideoGenerator sẽ hiển thị
   - Có thể tạo video mới từ ảnh của đồ

## Implementation

### Hiện tại (Mock)
- API endpoint: `/api/ai/generate-video`
- Component: `VideoGenerator.tsx`
- Trả về video demo URL

### Production Implementation

Để triển khai thật, bạn có thể:

#### Option 1: Sử dụng FFmpeg (Server-side)
```bash
npm install fluent-ffmpeg
```

Cần cài đặt FFmpeg trên server:
- Windows: Download từ https://ffmpeg.org/
- Linux: `sudo apt-get install ffmpeg`
- Mac: `brew install ffmpeg`

#### Option 2: Sử dụng Remotion (React-based)
```bash
npm install remotion @remotion/cli
```

#### Option 3: Sử dụng Cloud Services
- **RunwayML API**: https://runwayml.com/
- **Synthesia API**: https://www.synthesia.io/
- **D-ID API**: https://www.d-id.com/
- **AWS Elemental MediaConvert**
- **Google Cloud Video Intelligence**

#### Option 4: Sử dụng Cloud Functions
- AWS Lambda với FFmpeg layer
- Google Cloud Functions
- Vercel Serverless Functions

## Ví dụ code với FFmpeg

```typescript
import ffmpeg from 'fluent-ffmpeg'
import { promises as fs } from 'fs'
import path from 'path'

async function generateVideo(images: string[], title: string, description: string) {
  // Download images
  const imagePaths = await downloadImages(images)
  
  // Create video
  const outputPath = path.join('/tmp', `video-${Date.now()}.mp4`)
  
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagePaths[0])
      .inputOptions(['-loop', '1', '-t', '4'])
      .videoFilters([
        'scale=1280:720',
        'fps=30',
        `drawtext=text='${title}':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=50`,
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-shortest',
      ])
      .output(outputPath)
      .on('end', async () => {
        // Upload to storage (S3, Cloudinary, etc.)
        const videoUrl = await uploadToStorage(outputPath)
        resolve(videoUrl)
      })
      .on('error', reject)
      .run()
  })
}
```

## Storage

Video cần được lưu trữ trên:
- **Cloudinary**: https://cloudinary.com/
- **AWS S3**: https://aws.amazon.com/s3/
- **Google Cloud Storage**: https://cloud.google.com/storage
- **Vercel Blob**: https://vercel.com/docs/storage/vercel-blob

## Database

Đã thêm field `promoVideoUrl` vào model `Item` trong Prisma schema để lưu URL video.

## Next Steps

1. Chọn phương pháp tạo video (FFmpeg, Remotion, hoặc Cloud Service)
2. Implement logic tạo video thật trong `/app/api/ai/generate-video/route.ts`
3. Setup storage để lưu video
4. Update database khi video được tạo
5. Test và optimize









