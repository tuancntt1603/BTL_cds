import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        item: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, buyerId, transactionType } = body

    if (!itemId || !buyerId || !transactionType) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Không tìm thấy đồ' },
        { status: 404 }
      )
    }

    if (item.userId === buyerId) {
      return NextResponse.json(
        { error: 'Bạn không thể mua/đổi đồ của chính mình' },
        { status: 400 }
      )
    }

    const qrCode = crypto.randomBytes(16).toString('hex')

    const transaction = await prisma.transaction.create({
      data: {
        itemId,
        buyerId,
        sellerId: item.userId,
        transactionType,
        qrCode,
      },
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

    // Tạo thông báo
    await prisma.notification.create({
      data: {
        userId: item.userId,
        type: 'transaction',
        title: 'Giao dịch mới',
        message: `${transaction.buyer.name} muốn ${transactionType === 'exchange' ? 'đổi' : transactionType === 'gift' ? 'nhận tặng' : 'mua'} đồ của bạn`,
        link: `/transactions/${transaction.id}`,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}












