import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

function toCSV(rows: string[][]): string {
  return rows
    .map(row =>
      row
        .map(cell => {
          const str = String(cell ?? '')
          // Escape quotes and wrap in quotes if needed
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        })
        .join(',')
    )
    .join('\n')
}

export async function GET(req: NextRequest) {
  // Only admins can export
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 })
  }

  const type = req.nextUrl.searchParams.get('type') || 'orders'
  const now = new Date().toLocaleDateString('uz-UZ')

  let csvData: string[][] = []
  let filename = ''

  if (type === 'orders') {
    filename = `buyurtmalar_${now}.csv`
    const orders = await prisma.order.findMany({
      include: {
        service: true,
        group: true,
        client: { select: { name: true, username: true } },
        review: true
      },
      orderBy: { createdAt: 'desc' }
    })

    csvData = [
      ['ID', 'Mijoz', 'Xizmat', 'Guruh', 'Hudud', 'Narx (soʼm)', 'Status', 'Tavsif', 'Yaratilgan sana', 'Baho'],
      ...orders.map(o => [
        o.id.substring(0, 8).toUpperCase(),
        o.client.name,
        o.service.name,
        o.group?.name || '—',
        o.region,
        String(o.price),
        o.status,
        o.description.substring(0, 100),
        new Date(o.createdAt).toLocaleDateString('uz-UZ'),
        String(o.review?.rating || '—')
      ])
    ]
  } else if (type === 'users') {
    filename = `foydalanuvchilar_${now}.csv`
    const users = await prisma.user.findMany({
      include: {
        group: { include: { direction: true } },
        _count: { select: { tasks: true, orders: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    csvData = [
      ['ID', 'Ism', 'Login', 'Rol', 'Guruh', "Yo'nalish", 'Hudud', "Vazifalar soni", 'Yaratilgan sana'],
      ...users.map(u => [
        u.id.substring(0, 8).toUpperCase(),
        u.name,
        u.username,
        u.role,
        u.group?.name || '—',
        u.group?.direction?.name || '—',
        u.group?.region || '—',
        String(u._count.tasks),
        new Date(u.createdAt).toLocaleDateString('uz-UZ')
      ])
    ]
  } else if (type === 'groups') {
    filename = `guruhlar_${now}.csv`
    const groups = await prisma.group.findMany({
      include: {
        direction: true,
        leader: { select: { name: true } },
        _count: { select: { orders: true, students: true } },
        reviews: { select: { rating: true } }
      },
      orderBy: { balance: 'desc' }
    })

    csvData = [
      ['Guruh nomi', "Yo'nalish", 'Hudud', 'Rahbar', "Talabalar soni", 'Buyurtmalar', "O'rtacha baho", "Balans (soʼm)"],
      ...groups.map(g => {
        const avgRating = g.reviews.length
          ? (g.reviews.reduce((a, b) => a + b.rating, 0) / g.reviews.length).toFixed(1)
          : '—'
        return [
          g.name,
          g.direction.name,
          g.region,
          g.leader?.name || '—',
          String(g._count.students),
          String(g._count.orders),
          avgRating,
          String(g.balance)
        ]
      })
    ]
  } else {
    return NextResponse.json({ error: "Noto'g'ri tur" }, { status: 400 })
  }

  const csv = '\uFEFF' + toCSV(csvData) // BOM for Excel UTF-8 support

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store'
    }
  })
}
