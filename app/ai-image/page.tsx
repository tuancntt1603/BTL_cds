'use client'

import ImageGenerator from '@/components/ImageGenerator'

export default function AIImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Tạo Ảnh</h1>
        <p className="text-gray-600">
          Tạo ảnh sản phẩm chuyên nghiệp bằng AI từ mô tả của bạn
        </p>
      </div>

      <ImageGenerator />
    </div>
  )
}









