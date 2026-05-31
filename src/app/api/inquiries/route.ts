import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// 请求验证 Schema
// ============================================

const inquiryRequestSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  destination: z.string().min(1),
  travelDate: z.string().optional(),
  isFlexible: z.boolean().optional(),
  duration: z.number().optional(),
  travelers: z.number().min(1).max(50).default(1),
  travelerType: z.enum(['Couple', 'Family', 'Solo', 'Friends']).optional(),
  budget: z.string().optional(),
  emotions: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

// Mock ID counter
let mockIdCounter = 100;

// ============================================
// POST - 创建咨询 (Mock)
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquiryRequestSchema.parse(body);

    // Mock: simulate creating an inquiry
    mockIdCounter++;
    const mockId = `mock_inquiry_${mockIdCounter}`;

    console.log('[Mock] Inquiry created:', { id: mockId, ...validated });

    // TODO: 发送邮件通知旅行专家
    // TODO: 发送确认邮件给客户

    return NextResponse.json(
      { success: true, id: mockId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - 查询咨询列表 (Mock)
// ============================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const mockInquiries = [
    { id: 'mock_inquiry_101', firstName: '蒙', lastName: '郝', email: 'haomeng@example.com', destination: '东京·京都', budget: '¥30,000', status: 'NEW', createdAt: '2026-05-30' },
    { id: 'mock_inquiry_102', firstName: '三', lastName: '张', email: 'zhangsan@example.com', destination: '北海道', budget: '¥25,000', status: 'CONTACTED', createdAt: '2026-05-29' },
    { id: 'mock_inquiry_103', firstName: '四', lastName: '李', email: 'lisi@example.com', destination: '冲绳', budget: '¥15,000', status: 'IN_PROGRESS', createdAt: '2026-05-28' },
  ];

  const filtered = status ? mockInquiries.filter((i) => i.status === status) : mockInquiries;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    inquiries: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  });
}
