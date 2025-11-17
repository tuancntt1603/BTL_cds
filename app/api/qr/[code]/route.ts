import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // Tìm item hoặc transaction theo QR code
    const item = await prisma.item.findUnique({
      where: { qrCode: params.code },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    })

    if (item) {
      return NextResponse.json({ type: 'item', data: item })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { qrCode: params.code },
      include: {
        item: true,
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (transaction) {
      return NextResponse.json({ type: 'transaction', data: transaction })
    }

    return NextResponse.json(
      { error: 'QR code không hợp lệ' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Get QR code error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}












