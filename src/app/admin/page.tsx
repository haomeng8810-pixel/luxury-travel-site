import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [tripCount, destinationCount, inquiryCount, reviewCount, newInquiries, bookedInquiries, statsByStatus] = await Promise.all([
    prisma.trip.count(),
    prisma.destination.count(),
    prisma.inquiry.count(),
    prisma.review.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.inquiry.count({ where: { status: 'BOOKED' } }),
    prisma.inquiry.groupBy({ by: ['status'], _count: true }),
  ]);

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const featuredTrips = await prisma.trip.count({ where: { isFeatured: true } });
  const activeDestinations = await prisma.destination.count({ where: { isActive: true } });

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">管理后台</h1>

      {/* 核心统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatCard title="行程" value={tripCount} icon="🗺️" color="bg-blue-500" />
        <StatCard title="推荐行程" value={featuredTrips} icon="⭐" color="bg-yellow-500" />
        <StatCard title="目的地" value={destinationCount} icon="📍" color="bg-green-500" />
        <StatCard title="咨询总数" value={inquiryCount} icon="📧" color="bg-purple-500" />
        <StatCard title="新咨询" value={newInquiries} icon="🔔" color="bg-red-500" alert={newInquiries > 0} />
        <StatCard title="已预订" value={bookedInquiries} icon="✅" color="bg-emerald-500" />
        <StatCard title="评价" value={reviewCount} icon="💬" color="bg-indigo-500" />
      </div>

      {/* 咨询状态分布 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">咨询状态分布</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = statsByStatus.find(s => s.status === key)?._count || 0;
            const percentage = inquiryCount > 0 ? Math.round((count / inquiryCount) * 100) : 0;
            return (
              <Link href={`/admin/inquiries?status=${key}`} key={key} className="flex-1 min-w-[120px]">
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[key]}`}>{label}</span>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${statusColors[key].split(' ')[0].replace('100', '500')}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{percentage}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 最新咨询 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">最新咨询</h2>
          <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:underline">查看全部 →</Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="text-gray-400 py-4">暂无咨询记录</p>
        ) : (
          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{inq.firstName}{inq.lastName}</p>
                  <p className="text-sm text-gray-500">
                    {inq.email}
                    {inq.destination && <span className="ml-2">📍 {inq.destination}</span>}
                  </p>
                  {inq.budget && <p className="text-xs text-gray-400 mt-1">预算: {inq.budget}</p>}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">行程管理</h2>
          <div className="space-y-2">
            <Link href="/admin/trips/new" className="block text-sm text-blue-600 hover:underline">+ 新增行程</Link>
            <Link href="/admin/trips" className="block text-sm text-gray-600 hover:underline">管理所有行程</Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">目的地管理</h2>
          <div className="space-y-2">
            <Link href="/admin/destinations/new" className="block text-sm text-blue-600 hover:underline">+ 新增目的地</Link>
            <Link href="/admin/destinations" className="block text-sm text-gray-600 hover:underline">管理所有目的地</Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">咨询管理</h2>
          <div className="space-y-2">
            <Link href="/admin/inquiries?status=NEW" className="block text-sm text-red-600 hover:underline">处理新咨询 ({newInquiries})</Link>
            <Link href="/admin/inquiries" className="block text-sm text-gray-600 hover:underline">查看所有咨询</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, alert }: { title: string; value: number; icon: string; color: string; alert?: boolean }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 relative ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      {alert && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      )}
    </div>
  );
}
