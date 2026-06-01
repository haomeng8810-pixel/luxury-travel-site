import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '../../../database/generated/client.js';

// ============================================
// Admin Inquiries - List with Search & Filter
// ============================================

const statusLabels: Record<string, string> = {
  NEW: '新咨询',
  CONTACTED: '已联系',
  IN_PROGRESS: '处理中',
  QUOTED: '已报价',
  BOOKED: '已预订',
  CLOSED: '已关闭',
  LOST: '已流失',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  BOOKED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
};

async function updateStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await prisma.inquiry.update({
    where: { id },
    data: { status: status as any },
  });
  revalidatePath('/admin/inquiries');
}

async function deleteInquiry(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath('/admin/inquiries');
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; travelerType?: string };
}) {
  const { search, status, travelerType } = searchParams;

  const where: Prisma.InquiryWhereInput = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { destination: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status as any;
  }

  if (travelerType) {
    where.travelerType = travelerType;
  }

  const [inquiries, stats] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.inquiry.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">咨询管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {inquiries.length} 条咨询
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = stats.find(s => s.status === key)?._count || 0;
          return (
            <div key={key} className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${statusColors[key]}`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <form className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input
              name="search"
              defaultValue={search}
              placeholder="搜索客户姓名、邮箱、目的地..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select name="status" defaultValue={status} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">全部状态</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">出行类型</label>
            <select name="travelerType" defaultValue={travelerType} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">全部类型</option>
              <option value="Couple">情侣</option>
              <option value="Family">家庭</option>
              <option value="Solo">单人</option>
              <option value="Friends">朋友</option>
            </select>
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
            筛选
          </button>
          {(search || status || travelerType) && (
            <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:underline">
              清除筛选
            </Link>
          )}
        </div>
      </form>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-400">暂无咨询记录</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">客户</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">联系方式</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">需求</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{inq.firstName}{inq.lastName}</p>
                    {inq.travelerType && (
                      <p className="text-xs text-gray-500 mt-1">
                        {inq.travelerType === 'Couple' ? '👫 情侣' :
                         inq.travelerType === 'Family' ? '👨‍👩‍👧‍👦 家庭' :
                         inq.travelerType === 'Solo' ? '🧑 单人' : '👬 朋友'}
                        {inq.travelers ? ` · ${inq.travelers}人` : ''}
                      </p>
                    )}
                    {inq.budget && (
                      <p className="text-xs text-gray-500">预算: {inq.budget}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{inq.email}</p>
                    {inq.phone && <p>{inq.phone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    {inq.destination && (
                      <p className="text-sm text-gray-600">📍 {inq.destination}</p>
                    )}
                    {inq.notes && (
                      <p className="text-sm text-gray-500 max-w-xs truncate" title={inq.notes}>
                        {inq.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <form action={updateStatus} className="inline">
                      <input type="hidden" name="id" value={inq.id} />
                      <select
                        name="status"
                        defaultValue={inq.status}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${statusColors[inq.status]}`}
                        onChange={(e) => e.target.form?.requestSubmit()}
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteInquiry} className="inline">
                      <input type="hidden" name="id" value={inq.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={(e) => {
                          if (!confirm('确定删除此咨询？')) e.preventDefault();
                        }}
                      >
                        删除
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
