import Link from 'next/link';

const MOCK_INQUIRIES = [
  { id: '1', firstName: '蒙', lastName: '郝', email: 'haomeng@example.com', phone: '138****1234', destination: '东京·京都', budget: 30000, status: 'NEW', date: '2026-05-30' },
  { id: '2', firstName: '三', lastName: '张', email: 'zhangsan@example.com', phone: '139****5678', destination: '北海道', budget: 25000, status: 'CONTACTED', date: '2026-05-29' },
  { id: '3', firstName: '四', lastName: '李', email: 'lisi@example.com', phone: '136****9012', destination: '冲绳', budget: 15000, status: 'IN_PROGRESS', date: '2026-05-28' },
  { id: '4', firstName: '五', lastName: '王', email: 'wangwu@example.com', phone: '137****3456', destination: '大阪', budget: 20000, status: 'QUOTED', date: '2026-05-27' },
  { id: '5', firstName: '六', lastName: '赵', email: 'zhaoliu@example.com', phone: '135****7890', destination: '东京·京都', budget: 40000, status: 'BOOKED', date: '2026-05-26' },
  { id: '6', firstName: '七', lastName: '钱', email: 'qianqi@example.com', phone: '133****2345', destination: '京都', budget: 35000, status: 'CLOSED', date: '2026-05-25' },
];

const statusLabels: Record<string, string> = {
  NEW: '新咨询', CONTACTED: '已联系', IN_PROGRESS: '处理中',
  QUOTED: '已报价', BOOKED: '已预订', CLOSED: '已关闭', LOST: '已流失',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800', CONTACTED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800', QUOTED: 'bg-purple-100 text-purple-800',
  BOOKED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
};

export default async function AdminInquiriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">咨询管理</h1>

      {/* 筛选器 */}
      <div className="mb-6 flex space-x-4">
        <select className="px-4 py-2 border border-gray-300 rounded">
          <option value="">所有状态</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input type="text" placeholder="搜索客户姓名或邮箱..." className="px-4 py-2 border border-gray-300 rounded flex-1" />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">客户信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">目的地</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预算</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_INQUIRIES.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{inq.firstName}{inq.lastName}</div>
                  <div className="text-sm text-gray-500">{inq.email}</div>
                  <div className="text-sm text-gray-500">{inq.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{inq.destination}</td>
                <td className="px-6 py-4 text-sm text-gray-500">¥{inq.budget.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs rounded-full ${statusColors[inq.status]}`}>
                    {statusLabels[inq.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{inq.date}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link href={`/admin/inquiries/${inq.id}`} className="text-blue-600 hover:text-blue-900">查看</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
