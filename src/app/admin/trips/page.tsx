import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ============================================
// Admin Trips - List
// ============================================

async function deleteTrip(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.trip.delete({ where: { id } });
  revalidatePath('/admin/trips');
}

async function toggleFeatured(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const featured = formData.get('featured') === 'true';
  await prisma.trip.update({
    where: { id },
    data: { isFeatured: !featured },
  });
  revalidatePath('/admin/trips');
}

export default async function AdminTripsPage() {
  const trips = await prisma.trip.findMany({
    include: { destination: true, emotion: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">行程管理</h1>
        <Link
          href="/admin/trips/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + 新增行程
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-400 mb-4">暂无行程数据</p>
          <Link href="/admin/trips/new" className="text-blue-600 hover:underline">
            创建第一个行程 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">行程</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">目的地</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">天数</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">价格</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{trip.title}</p>
                    <p className="text-sm text-gray-500">{trip.titleCn}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trip.destination?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trip.duration}天 / {trip.nights}晚</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {trip.isInquireOnly ? '询价' : `${trip.priceCurrency} ${trip.priceFrom?.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {trip.isActive && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">上架</span>
                      )}
                      {trip.isFeatured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">推荐</span>
                      )}
                      {trip.isExclusive && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">独家</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/trips/${trip.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">
                        编辑
                      </Link>
                      <form action={toggleFeatured} className="inline">
                        <input type="hidden" name="id" value={trip.id} />
                        <input type="hidden" name="featured" value={String(trip.isFeatured)} />
                        <button type="submit" className="text-yellow-600 hover:text-yellow-800 text-sm">
                          {trip.isFeatured ? '取消推荐' : '设为推荐'}
                        </button>
                      </form>
                      <form action={deleteTrip} className="inline">
                        <input type="hidden" name="id" value={trip.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={(e) => {
                            if (!confirm('确定删除此行程？')) e.preventDefault();
                          }}
                        >
                          删除
                        </button>
                      </form>
                    </div>
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
