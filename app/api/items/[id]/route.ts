import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            city: true,
            reputation: true,
            totalReviews: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Không tìm thấy đồ' },
        { status: 404 }
      )
    }

    // Tăng lượt xem
    await prisma.item.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ ...item, views: item.views + 1 })
  } catch (error) {
    console.error('Get item error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, condition, images, transactionType, price, city, address, latitude, longitude, userId } = body

    // Kiểm tra quyền sở hữu
    const item = await prisma.item.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Không tìm thấy đồ' },
        { status: 404 }
      )
    }

    if (item.userId !== userId) {
      return NextResponse.json(
        { error: 'Bạn không có quyền sửa đồ này' },
        { status: 403 }
      )
    }

    const updatedItem = await prisma.item.update({
      where: { id: params.id },
      data: {
        title: title || item.title,
        description: description || item.description,
        category: category || item.category,
        condition: condition || item.condition,
        images: images || item.images,
        transactionType: transactionType || item.transactionType,
        price: price !== undefined ? price : item.price,
        city: city || item.city,
        address: address || item.address,
        latitude: latitude || item.latitude,
        longitude: longitude || item.longitude,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Update item error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      )
    }

    const item = await prisma.item.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Không tìm thấy đồ' },
        { status: 404 }
      )
    }

    if (item.userId !== userId) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xóa đồ này' },
        { status: 403 }
      )
    }

    await prisma.item.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error('Delete item error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}
