'use client'

import { useState } from 'react'
import { Image as ImageIcon, Sparkles, Loader, Download, Wand2 } from 'lucide-react'
import Image from 'next/image'

interface ImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void
  defaultPrompt?: string
}

export default function ImageGenerator({
  onImageGenerated,
  defaultPrompt = '',
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [style, setStyle] = useState('realistic')
  const [size, setSize] = useState('1024x1024')
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle')
  const [error, setError] = useState('')

  const quickPrompts = [
    'Sản phẩm đồ cũ chất lượng cao',
    'Đồ điện tử cũ còn mới',
    'Quần áo trẻ em đẹp',
    'Đồ gia dụng hiện đại',
    'Sách giáo khoa mới',
  ]

  const styles = [
    { value: 'realistic', label: 'Thực tế' },
    { value: 'artistic', label: 'Nghệ thuật' },
    { value: 'minimalist', label: 'Tối giản' },
    { value: 'vintage', label: 'Cổ điển' },
  ]

  const sizes = [
    { value: '512x512', label: '512x512 (Nhỏ)' },
    { value: '1024x1024', label: '1024x1024 (Vừa)' },
    { value: '1024x1792', label: '1024x1792 (Dọc)' },
    { value: '1792x1024', label: '1792x1024 (Ngang)' },
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Vui lòng nhập mô tả ảnh')
      return
    }

    setLoading(true)
    setError('')
    setStatus('generating')
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          size,
        }),
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        console.log('Image URL received:', data.imageUrl)
        setImageId(data.imageId)
        setGeneratedImage(data.imageUrl)
        setStatus('completed')
        
        if (onImageGenerated && data.imageUrl) {
          setTimeout(() => {
            onImageGenerated(data.imageUrl)
          }, 500)
        }
      } else {
        setError(data.error || 'Có lỗi xảy ra hoặc không nhận được ảnh')
        setStatus('error')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      setError('Có lỗi xảy ra khi tạo ảnh')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `ai-generated-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const useImage = () => {
    if (generatedImage && onImageGenerated) {
      onImageGenerated(generatedImage)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold">AI Tạo Ảnh</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả ảnh <span className="text-red-500">*</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ví dụ: Sản phẩm đồ cũ chất lượng cao, nền trắng, ánh sáng tự nhiên..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Mô tả càng chi tiết, ảnh càng đẹp
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phong cách
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {styles.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kích thước
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sizes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {prompt.length === 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Gợi ý nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(quickPrompt)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {status === 'generating' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Đang tạo ảnh bằng AI... Vui lòng đợi (10-30 giây)</span>
          </div>
        </div>
      )}

      {status === 'completed' && generatedImage && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Ảnh đã được tạo thành công!
          </div>
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e)
                setError('Không thể tải ảnh. Vui lòng thử lại.')
              }}
            />
          </div>
          <div className="flex gap-2">
            {onImageGenerated && (
              <button
                onClick={useImage}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Sử dụng ảnh này</span>
              </button>
            )}
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Tải ảnh</span>
            </button>
            <button
              onClick={() => {
                setGeneratedImage(null)
                setStatus('idle')
                setImageId(null)
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Tạo ảnh mới
            </button>
          </div>
        </div>
      )}

      {status !== 'completed' && (
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Đang tạo ảnh...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>AI Tạo Ảnh</span>
            </>
          )}
        </button>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>✨ AI sẽ tạo ảnh dựa trên mô tả của bạn</p>
        <p>💡 Mẹo: Mô tả càng chi tiết về màu sắc, phong cách, nền... ảnh càng đẹp</p>
      </div>
    </div>
  )
}

