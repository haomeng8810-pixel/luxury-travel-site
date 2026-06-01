import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    tripCount, destinationCount, inquiryCount, reviewCount, articleCount, expertCount, podcastCount, emotionCount,
    newInquiries, bookedInquiries, statsByStatus,
    featuredTrips, activeDestinations, publishedArticles, availableExperts, publishedPodcasts
  ] = await Promise.all([
    prisma.trip.count(),
    prisma.destination.count(),
    prisma.inquiry.count(),
    prisma.review.count(),
    prisma.article.count(),
    prisma.travelExpert.count(),
    prisma.podcast.count(),
    prisma.emotion.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.inquiry.count({ where: { status: 'BOOKED' } }),
    prisma.inquiry.groupBy({ by: ['status'], _count: true }),
    prisma.trip.count({ where: { isFeatured: true } }),
    prisma.destination.count({ where: { isActive: true } }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.travelExpert.count({ where: { isAvailable: true } }),
    prisma.podcast.count({ where: { isPublished: true } }),
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">管理后台</h1>

      {/* 核心统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <StatCard title="行程" value={tripCount} sub={featuredTrips > 0 ? `${featuredTrips}推荐` : undefined} icon="🗺️" color="bg-blue-500" />
        <StatCard title="目的地" value={destinationCount} sub={activeDestinations > 0 ? `${activeDestinations}活跃` : undefined} icon="📍" color="bg-green-500" />
        <StatCard title="文章" value={articleCount} sub={publishedArticles > 0 ? `${publishedArticles}已发布` : undefined} icon="📝" color="bg-orange-500" />
        <StatCard title="旅行专家" value={expertCount} sub={availableExperts > 0 ? `${availableExperts}可接单` : undefined} icon="👤" color="bg-indigo-500" />
        <StatCard title="评价" value={reviewCount} icon="⭐" color="bg-pink-500" />
        <StatCard title="播客" value={podcastCount} sub={publishedPodcasts > 0 ? `${publishedPodcasts}已发布` : undefined} icon="🎙️" color="bg-purple-500" />
        <StatCard title="咨询" value={inquiryCount} sub={newInquiries > 0 ? `${newInquiries}新咨询` : undefined} icon="📩" color="bg-red-500" alert={newInquiries > 0} />
        <StatCard title="情感标签" value={emotionCount} icon="💭" color="bg-teal-500" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard title="行程管理" icon="🗺️" actions={[
          { label: '+ 新增行程', href: '/admin/trips/new', primary: true },
          { label: '管理所有行程', href: '/admin/trips' },
        ]} />
        <QuickActionCard title="内容管理" icon="📝" actions={[
          { label: '+ 新建文章', href: '/admin/articles/new', primary: true },
          { label: '管理文章', href: '/admin/articles' },
          { label: '管理播客', href: '/admin/podcasts' },
        ]} />
        <QuickActionCard title="团队管理" icon="👤" actions={[
          { label: '+ 新增专家', href: '/admin/experts/new', primary: true },
          { label: '管理专家', href: '/admin/experts' },
          { label: '情感标签', href: '/admin/emotions' },
        ]} />
        <QuickActionCard title="客户管理" icon="📩" actions={[
          { label: `处理新咨询 (${newInquiries})`, href: '/admin/inquiries?status=NEW', primary: newInquiries > 0 },
          { label: '所有咨询', href: '/admin/inquiries' },
          { label: '评价管理', href: '/admin/reviews' },
        ]} />
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color, alert }: { title: string; value: number; sub?: string; icon: string; color: string; alert?: boolean }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 relative ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{title}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      {alert && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      )}
    </div>
  );
}

function QuickActionCard({ title, icon, actions }: { title: string; icon: string; actions: { label: string; href: string; primary?: boolean }[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`block text-sm ${action.primary ? 'text-blue-600 font-medium hover:underline' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
