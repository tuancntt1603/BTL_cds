import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const condition = searchParams.get('condition')
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const transactionType = searchParams.get('transactionType')
    const status = searchParams.get('status') || 'available'

    const where: any = { status }

    if (category) {
      where.category = category
    }

    if (condition) {
      where.condition = condition
    }

    if (city) {
      where.city = { contains: city }
    }

    if (transactionType) {
      where.transactionType = transactionType
    }

    if (search) {
      // SQLite doesn't support case-insensitive mode, so we use contains
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Get items error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      category, 
      condition, 
      images, 
      transactionType,
      price,
      city,
      address,
      latitude,
      longitude,
      userId 
    } = body

    if (!title || !description || !category || !condition || !userId) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    // Tạo QR code unique
    const qrCode = crypto.randomBytes(16).toString('hex')

    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        condition,
        images: images ? JSON.stringify(images) : null,
        transactionType: transactionType || 'exchange',
        price: transactionType === 'sell' ? price : null,
        city: city || null,
        address: address || null,
        latitude: latitude || null,
        longitude: longitude || null,
        qrCode,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            city: true,
          },
        },
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Create item error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

