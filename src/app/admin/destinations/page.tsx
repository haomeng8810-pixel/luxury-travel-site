import Link from 'next/link';

const MOCK_DESTINATIONS = [
  { id: '1', nameCn: '东京', name: 'Tokyo', continent: 'Asia', tripCount: 12, isActive: true },
  { id: '2', nameCn: '京都', name: 'Kyoto', continent: 'Asia', tripCount: 8, isActive: true },
  { id: '3', nameCn: '大阪', name: 'Osaka', continent: 'Asia', tripCount: 6, isActive: true },
  { id: '4', nameCn: '北海道', name: 'Hokkaido', continent: 'Asia', tripCount: 10, isActive: true },
  { id: '5', nameCn: '冲绳', name: 'Okinawa', continent: 'Asia', tripCount: 7, isActive: true },
];

const continentLabels: Record<string, string> = {
  Asia: '亚洲', Europe: '欧洲', 'North America': '北美洲',
  'South America': '南美洲', Africa: '非洲', Oceania: '大洋洲',
  'Arctic Circle': '极地', 'Middle East': '中东',
};

export default async function AdminDestinationsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">目的地管理</h1>
        <Link href="/admin/destinations/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          添加新目的地
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">大洲</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">行程数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_DESTINATIONS.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{d.nameCn}</div>
                  <div className="text-sm text-gray-500">{d.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{continentLabels[d.continent] || d.continent}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.tripCount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs rounded-full ${d.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {d.isActive ? '激活' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link href={`/admin/destinations/${d.id}`} className="text-blue-600 hover:text-blue-900 mr-4">编辑</Link>
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
