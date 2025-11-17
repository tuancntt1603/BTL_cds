'use client'

import { useState, useEffect } from 'react'
import { QrCode } from 'lucide-react'

interface QRCodeDisplayProps {
  qrCode: string
  itemTitle?: string
}

export default function QRCodeDisplay({ qrCode, itemTitle }: QRCodeDisplayProps) {
  const [showQR, setShowQR] = useState(false)

  // Generate QR code URL using a QR code API
  const getQRCodeUrl = () => {
    if (typeof window === 'undefined') return ''
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      `${window.location.origin}/qr/${qrCode}`
    )}`
  }
  
  const qrCodeUrl = getQRCodeUrl()

  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowQR(!showQR)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <QrCode className="w-5 h-5" />
        <span>Xem QR Code</span>
      </button>
      
      {showQR && (
        <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-primary-200">
          {itemTitle && (
            <p className="text-center font-semibold mb-2">{itemTitle}</p>
          )}
          <div className="flex justify-center">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Quét mã này để xem thông tin đồ
          </p>
        </div>
      )}
    </div>
  )
}

