import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const otherUserId = searchParams.get('otherUserId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      )
    }

    let where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    }

    if (otherUserId) {
      where = {
        OR: [
          {
            AND: [
              { senderId: userId },
              { receiverId: otherUserId },
            ],
          },
          {
            AND: [
              { senderId: otherUserId },
              { receiverId: userId },
            ],
          },
        ],
      }
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Đánh dấu tin nhắn đã đọc
    if (otherUserId) {
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          senderId: otherUserId,
          isRead: false,
        },
        data: { isRead: true },
      })
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, receiverId, content, image, itemId } = body

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        image: image || null,
        itemId: itemId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Tạo thông báo
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'chat',
        title: 'Tin nhắn mới',
        message: `${message.sender.name}: ${content.substring(0, 50)}...`,
        link: `/chat/${senderId}`,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}












