'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import VideoGenerator from '@/components/VideoGenerator'
import ImageGenerator from '@/components/ImageGenerator'

export default function NewItemPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    images: [] as string[],
    transactionType: 'exchange',
    price: '',
    city: '',
    address: '',
  })
  const [imageInput, setImageInput] = useState('')

  const categories = [
    'Đồ điện tử',
    'Quần áo',
    'Đồ gia dụng',
    'Sách',
    'Đồ chơi',
    'Nội thất',
    'Khác',
  ]

  const conditions = ['Mới', 'Còn tốt', 'Đã qua sử dụng']

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      })
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.transactionType === 'sell' ? parseFloat(formData.price) : null,
          userId: user.id,
        }),
      })

      if (response.ok) {
        alert('Đăng đồ thành công!')
        router.push('/items')
      } else {
        const data = await response.json()
        alert(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Đăng đồ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình thức giao dịch <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transactionType: 'exchange' })}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.transactionType === 'exchange'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Đổi đồ
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transactionType: 'gift' })}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.transactionType === 'gift'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Tặng miễn phí
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transactionType: 'sell' })}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.transactionType === 'sell'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Bán giá rẻ
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ví dụ: Quần áo trẻ em size 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mô tả chi tiết về đồ cần đổi..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tình trạng <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Chọn tình trạng</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.transactionType === 'sell' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required={formData.transactionType === 'sell'}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="100000"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thành phố
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Số nhà, tên đường, quận/huyện"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tùy chọn)
            </label>
            
            {/* AI Image Generator */}
            <div className="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-primary-700 mb-2">
                💡 Hoặc dùng AI để tạo ảnh tự động từ mô tả sản phẩm
              </p>
              <ImageGenerator
                defaultPrompt={`${formData.title}, ${formData.description.substring(0, 50)}...`}
                onImageGenerated={(imageUrl) => {
                  console.log('Image generated, adding to form:', imageUrl)
                  if (imageUrl && !formData.images.includes(imageUrl)) {
                    setFormData({
                      ...formData,
                      images: [...formData.images, imageUrl],
                    })
                    alert('✅ Ảnh đã được thêm vào danh sách!')
                  }
                }}
              />
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImage()
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Hoặc dán link hình ảnh từ internet..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Thêm
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {formData.images.length} ảnh đã thêm:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load error:', img)
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Dán link hình ảnh từ internet (có thể thêm nhiều ảnh)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng...' : 'Đăng đồ'}
          </button>
        </form>
      </div>

      {/* AI Video Generator */}
      {formData.images.length > 0 && (
        <VideoGenerator
          itemTitle={formData.title}
          itemDescription={formData.description}
          onVideoGenerated={(videoUrl) => {
            // Có thể lưu video URL vào formData nếu cần
            console.log('Video generated:', videoUrl)
          }}
        />
      )}
    </div>
  )
}

