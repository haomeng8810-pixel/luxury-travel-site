import Link from 'next/link';

// ============================================
// Admin Dashboard (Mock Data)
// ============================================

const MOCK_STATS = {
  trips: 12,
  destinations: 15,
  inquiries: 48,
  newInquiries: 5,
  reviews: 128,
};

const MOCK_RECENT_INQUIRIES = [
  { name: '郝蒙', destination: '东京·京都', budget: '¥30,000', status: 'NEW', date: '2026-05-30' },
  { name: '张三', destination: '北海道', budget: '¥25,000', status: 'CONTACTED', date: '2026-05-29' },
  { name: '李四', destination: '冲绳', budget: '¥15,000', status: 'IN_PROGRESS', date: '2026-05-28' },
  { name: '王五', destination: '大阪', budget: '¥20,000', status: 'QUOTED', date: '2026-05-27' },
  { name: '赵六', destination: '东京·京都', budget: '¥40,000', status: 'BOOKED', date: '2026-05-26' },
];

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

export default async function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="行程总数" value={MOCK_STATS.trips} color="bg-blue-500" />
        <StatCard title="目的地总数" value={MOCK_STATS.destinations} color="bg-green-500" />
        <StatCard title="咨询总数" value={MOCK_STATS.inquiries} color="bg-purple-500" />
        <StatCard title="新咨询" value={MOCK_STATS.newInquiries} color="bg-yellow-500" />
        <StatCard title="客户评价" value={MOCK_STATS.reviews} color="bg-red-500" />
      </div>

      {/* 最新咨询 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最新咨询</h2>
        <div className="space-y-4">
          {MOCK_RECENT_INQUIRIES.map((inq, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{inq.name}</p>
                <p className="text-sm text-gray-500">{inq.destination} · {inq.budget}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[inq.status]}`}>
                  {statusLabels[inq.status]}
                </span>
                <p className="text-xs text-gray-400 mt-1">{inq.date}</p>
              </div>
            </div>
          ))}
        </div>
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
