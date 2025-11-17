import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, userId, message } = body

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Check if item exists and is available
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Không tìm thấy đồ' },
        { status: 404 }
      )
    }

    if (item.status !== 'available') {
      return NextResponse.json(
        { error: 'Đồ này không còn khả dụng' },
        { status: 400 }
      )
    }

    if (item.userId === userId) {
      return NextResponse.json(
        { error: 'Bạn không thể đổi đồ của chính mình' },
        { status: 400 }
      )
    }

    const exchange = await prisma.exchange.create({
      data: {
        itemId,
        userId,
        message: message || null,
      },
      include: {
        item: true,
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

    return NextResponse.json(exchange, { status: 201 })
  } catch (error) {
    console.error('Create exchange error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}












