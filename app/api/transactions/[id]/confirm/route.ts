import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { qrCode, userId } = body

    if (!qrCode || !userId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin' },
        { status: 400 }
      )
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { item: true },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Không tìm thấy giao dịch' },
        { status: 404 }
      )
    }

    // Kiểm tra quyền (chỉ người bán hoặc người mua mới xác nhận được)
    if (transaction.sellerId !== userId && transaction.buyerId !== userId) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xác nhận giao dịch này' },
        { status: 403 }
      )
    }

    // Kiểm tra QR code
    if (transaction.qrCode !== qrCode) {
      return NextResponse.json(
        { error: 'QR code không hợp lệ' },
        { status: 400 }
      )
    }

    // Xác nhận giao dịch
    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
      },
      include: {
        item: true,
        buyer: true,
      },
    })

    // Cập nhật trạng thái đồ
    await prisma.item.update({
      where: { id: transaction.itemId },
      data: { status: 'exchanged' },
    })

    // Tạo thông báo
    const otherUserId = userId === transaction.buyerId 
      ? transaction.sellerId 
      : transaction.buyerId

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: 'transaction',
        title: 'Giao dịch đã được xác nhận',
        message: `Giao dịch cho "${transaction.item.title}" đã được xác nhận`,
        link: `/transactions/${params.id}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Confirm transaction error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}












