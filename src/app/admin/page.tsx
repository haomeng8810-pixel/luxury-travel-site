import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [tripCount, destinationCount, inquiryCount, reviewCount, newInquiries] = await Promise.all([
    prisma.trip.count(),
    prisma.destination.count(),
    prisma.inquiry.count(),
    prisma.review.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
  ]);

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="行程总数" value={tripCount} color="bg-blue-500" />
        <StatCard title="目的地总数" value={destinationCount} color="bg-green-500" />
        <StatCard title="咨询总数" value={inquiryCount} color="bg-purple-500" />
        <StatCard title="新咨询" value={newInquiries} color="bg-yellow-500" />
        <StatCard title="客户评价" value={reviewCount} color="bg-red-500" />
      </div>

      {/* 最新咨询 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最新咨询</h2>
        {recentInquiries.length === 0 ? (
          <p className="text-gray-400 py-4">暂无咨询记录</p>
        ) : (
          <div className="space-y-4">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{inq.name}</p>
                  <p className="text-sm text-gray-500">{inq.email} · {inq.phone}</p>
                  {inq.message && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{inq.message}</p>}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[inq.status]}`}>
                    {statusLabels[inq.status]}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(inq.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LinkButton href="/admin/trips" label="管理行程" />
          <LinkButton href="/admin/destinations" label="管理目的地" />
          <LinkButton href="/admin/inquiries" label="查看所有咨询" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <span className="text-white text-xl font-bold">{value}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors">
      {label}
    </Link>
  );
}
