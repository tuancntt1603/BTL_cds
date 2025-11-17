import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Tạo user mẫu nếu chưa có
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    let user1 = await prisma.user.findUnique({
      where: { email: 'user1@example.com' },
    })
    
    if (!user1) {
      user1 = await prisma.user.create({
        data: {
          email: 'user1@example.com',
          name: 'Nguyễn Văn A',
          password: hashedPassword,
          phone: '0901234567',
          address: '123 Đường ABC, Quận 1',
          city: 'TP.HCM',
          latitude: 10.7769,
          longitude: 106.7009,
        },
      })
    }

    let user2 = await prisma.user.findUnique({
      where: { email: 'user2@example.com' },
    })
    
    if (!user2) {
      user2 = await prisma.user.create({
        data: {
          email: 'user2@example.com',
          name: 'Trần Thị B',
          password: hashedPassword,
          phone: '0907654321',
          address: '456 Đường XYZ, Quận 3',
          city: 'TP.HCM',
          latitude: 10.7829,
          longitude: 106.6909,
        },
      })
    }

    let user3 = await prisma.user.findUnique({
      where: { email: 'user3@example.com' },
    })
    
    if (!user3) {
      user3 = await prisma.user.create({
        data: {
          email: 'user3@example.com',
          name: 'Lê Văn C',
          password: hashedPassword,
          phone: '0912345678',
          address: '789 Đường DEF, Quận 5',
          city: 'TP.HCM',
          latitude: 10.7559,
          longitude: 106.6679,
        },
      })
    }

    // Dữ liệu đồ mẫu
    const sampleItems = [
      {
        title: 'Quần áo trẻ em size 5-6 tuổi',
        description: 'Bộ quần áo trẻ em còn mới, mặc được vài lần. Chất liệu cotton mềm mại, thoáng mát. Phù hợp cho bé 5-6 tuổi. Bao gồm: 2 áo thun, 1 quần dài, 1 quần short.',
        category: 'Quần áo',
        condition: 'Còn tốt',
        transactionType: 'exchange',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
        ]),
        city: 'TP.HCM',
        address: '123 Đường ABC, Quận 1',
        latitude: 10.7769,
        longitude: 106.7009,
        userId: user1.id,
      },
      {
        title: 'Điện thoại Samsung Galaxy cũ',
        description: 'Điện thoại Samsung Galaxy cũ, còn hoạt động tốt. Màn hình có vài vết xước nhỏ. Pin còn khoảng 70%. Kèm sạc và ốp lưng. Phù hợp để đổi hoặc tặng.',
        category: 'Đồ điện tử',
        condition: 'Đã qua sử dụng',
        transactionType: 'exchange',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        ]),
        city: 'TP.HCM',
        address: '456 Đường XYZ, Quận 3',
        latitude: 10.7829,
        longitude: 106.6909,
        userId: user2.id,
      },
      {
        title: 'Sách giáo khoa lớp 1-2',
        description: 'Bộ sách giáo khoa lớp 1 và lớp 2, còn mới, không viết vẽ gì. Bao gồm: Toán, Tiếng Việt, Tự nhiên và Xã hội. Tặng miễn phí cho ai cần.',
        category: 'Sách',
        condition: 'Mới',
        transactionType: 'gift',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
        ]),
        city: 'TP.HCM',
        address: '789 Đường DEF, Quận 5',
        latitude: 10.7559,
        longitude: 106.6679,
        userId: user3.id,
      },
      {
        title: 'Bàn ghế gỗ cũ',
        description: 'Bộ bàn ghế gỗ cũ, còn chắc chắn. Cần sơn lại hoặc đánh bóng. Kích thước: Bàn 120x60cm, ghế 4 cái. Phù hợp cho phòng khách hoặc phòng ăn nhỏ.',
        category: 'Nội thất',
        condition: 'Đã qua sử dụng',
        transactionType: 'sell',
        price: 500000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        ]),
        city: 'TP.HCM',
        address: '123 Đường ABC, Quận 1',
        latitude: 10.7769,
        longitude: 106.7009,
        userId: user1.id,
      },
      {
        title: 'Đồ chơi LEGO cũ',
        description: 'Bộ đồ chơi LEGO cũ, còn đầy đủ miếng ghép. Phù hợp cho trẻ 6-12 tuổi. Đã được vệ sinh sạch sẽ. Muốn đổi lấy đồ chơi khác hoặc sách.',
        category: 'Đồ chơi',
        condition: 'Còn tốt',
        transactionType: 'exchange',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        ]),
        city: 'TP.HCM',
        address: '456 Đường XYZ, Quận 3',
        latitude: 10.7829,
        longitude: 106.6909,
        userId: user2.id,
      },
      {
        title: 'Nồi cơm điện cũ',
        description: 'Nồi cơm điện cũ, còn hoạt động tốt. Dung tích 1.8L, phù hợp cho 2-3 người. Có vài vết xước bên ngoài nhưng chức năng vẫn tốt. Tặng miễn phí.',
        category: 'Đồ gia dụng',
        condition: 'Đã qua sử dụng',
        transactionType: 'gift',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
        ]),
        city: 'TP.HCM',
        address: '789 Đường DEF, Quận 5',
        latitude: 10.7559,
        longitude: 106.6679,
        userId: user3.id,
      },
      {
        title: 'Xe đạp trẻ em',
        description: 'Xe đạp trẻ em size 16 inch, phù hợp cho bé 4-6 tuổi. Còn mới, chỉ dùng được vài lần. Có bánh phụ, chuông, giỏ xe. Muốn đổi lấy đồ chơi hoặc sách.',
        category: 'Khác',
        condition: 'Còn tốt',
        transactionType: 'exchange',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500',
        ]),
        city: 'TP.HCM',
        address: '123 Đường ABC, Quận 1',
        latitude: 10.7769,
        longitude: 106.7009,
        userId: user1.id,
      },
      {
        title: 'Quạt máy cũ',
        description: 'Quạt máy cũ, còn hoạt động tốt. 3 tốc độ, có chế độ quay tự động. Cần vệ sinh lại. Bán giá rẻ 200k.',
        category: 'Đồ gia dụng',
        condition: 'Đã qua sử dụng',
        transactionType: 'sell',
        price: 200000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        ]),
        city: 'TP.HCM',
        address: '456 Đường XYZ, Quận 3',
        latitude: 10.7829,
        longitude: 106.6909,
        userId: user2.id,
      },
      {
        title: 'Tủ quần áo gỗ',
        description: 'Tủ quần áo gỗ cũ, còn chắc chắn. Kích thước: 150x50x180cm. Có 2 ngăn kéo và 1 cánh cửa. Cần sơn lại. Bán giá rẻ 800k.',
        category: 'Nội thất',
        condition: 'Đã qua sử dụng',
        transactionType: 'sell',
        price: 800000,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        ]),
        city: 'TP.HCM',
        address: '789 Đường DEF, Quận 5',
        latitude: 10.7559,
        longitude: 106.6679,
        userId: user3.id,
      },
      {
        title: 'Bộ bát đĩa sứ',
        description: 'Bộ bát đĩa sứ còn mới, chưa dùng. Bao gồm: 6 bát, 6 đĩa, 6 chén. Chất liệu sứ tốt, dễ vệ sinh. Tặng miễn phí cho ai cần.',
        category: 'Đồ gia dụng',
        condition: 'Mới',
        transactionType: 'gift',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
        ]),
        city: 'TP.HCM',
        address: '123 Đường ABC, Quận 1',
        latitude: 10.7769,
        longitude: 106.7009,
        userId: user1.id,
      },
    ]

    // Tạo các đồ mẫu
    const createdItems = []
    for (const itemData of sampleItems) {
      // Kiểm tra xem đồ đã tồn tại chưa (dựa vào title và userId)
      const existing = await prisma.item.findFirst({
        where: {
          title: itemData.title,
          userId: itemData.userId,
        },
      })

      if (!existing) {
        const qrCode = crypto.randomBytes(16).toString('hex')
        const item = await prisma.item.create({
          data: {
            ...itemData,
            qrCode,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        })
        createdItems.push(item)
      }
    }

    return NextResponse.json({
      message: `Đã tạo ${createdItems.length} đồ mẫu`,
      items: createdItems,
      users: {
        user1: { email: user1.email, password: '123456' },
        user2: { email: user2.email, password: '123456' },
        user3: { email: user3.email, password: '123456' },
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi tạo dữ liệu mẫu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}









