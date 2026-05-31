import Link from 'next/link';

const MOCK_TRIPS = [
  { id: '1', titleCn: '东京京都经典之旅', title: 'Tokyo Kyoto Classic', destination: '东京·京都', emotion: '宁静惬意', duration: 7, nights: 6, isActive: true },
  { id: '2', titleCn: '北海道冬日奇缘', title: 'Hokkaido Winter Romance', destination: '北海道', emotion: '焕然一新', duration: 6, nights: 5, isActive: true },
  { id: '3', titleCn: '冲绳海岛度假', title: 'Okinawa Beach Getaway', destination: '冲绳', emotion: '自由无束', duration: 5, nights: 4, isActive: true },
  { id: '4', titleCn: '大阪美食文化之旅', title: 'Osaka Gourmet Tour', destination: '大阪', emotion: '逃离喧嚣', duration: 4, nights: 3, isActive: true },
  { id: '5', titleCn: '京都庭院深度体验', title: 'Kyoto Garden Immersion', destination: '京都', emotion: '宁静惬意', duration: 8, nights: 7, isActive: false },
];

export default async function AdminTripsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">行程管理</h1>
        <Link href="/admin/trips/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          创建新行程
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">目的地</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">情感</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">天数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_TRIPS.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{trip.titleCn}</div>
                  <div className="text-sm text-gray-500">{trip.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{trip.destination}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{trip.emotion}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{trip.duration}天{trip.nights}晚</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs rounded-full ${trip.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {trip.isActive ? '激活' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link href={`/admin/trips/${trip.id}`} className="text-blue-600 hover:text-blue-900 mr-4">编辑</Link>
                  <button className="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
