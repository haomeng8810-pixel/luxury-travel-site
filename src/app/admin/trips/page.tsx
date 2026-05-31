import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// ============================================
// Admin Trips - List with Search & Filter
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
  const isFeatured = formData.get('isFeatured') === 'true';
  await prisma.trip.update({
    where: { id },
    data: { isFeatured: !isFeatured },
  });
  revalidatePath('/admin/trips');
}

async function toggleActive(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'true';
  await prisma.trip.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidatePath('/admin/trips');
}

export default async function AdminTripsPage({
  searchParams,
}: {
  searchParams: { search?: string; destination?: string; featured?: string; exclusive?: string };
}) {
  const { search, destination, featured, exclusive } = searchParams;

  // Build where clause
  const where: Prisma.TripWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { titleCn: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (destination) {
    where.destinationId = destination;
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  if (exclusive === 'true') {
    where.isExclusive = true;
  }

  const [trips, destinations] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { destination: true, emotion: true },
    }),
    prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalTrips = await prisma.trip.count();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">行程管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {totalTrips} 个行程，当前显示 {trips.length} 个
          </p>
        </div>
        <Link
          href="/admin/trips/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + 新增行程
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <form className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input
              name="search"
              defaultValue={search}
              placeholder="搜索行程名称、Slug..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">目的地</label>
            <select name="destination" defaultValue={destination} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">全部目的地</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.nameCn} / {d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" value="true" defaultChecked={featured === 'true'} />
              仅推荐
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="exclusive" value="true" defaultChecked={exclusive === 'true'} />
              仅独家
            </label>
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
            筛选
          </button>
          {(search || destination || featured || exclusive) && (
            <Link href="/admin/trips" className="text-sm text-blue-600 hover:underline">
              清除筛选
            </Link>
          )}
        </div>
      </form>

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">标签</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{trip.titleCn}</p>
                    <p className="text-sm text-gray-500">{trip.title}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{trip.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {trip.destination?.nameCn || trip.destination?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {trip.duration}天{trip.nights}晚
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {trip.isInquireOnly ? (
                      <span className="text-gray-400">仅询价</span>
                    ) : (
                      <span>{trip.priceCurrency} {Number(trip.priceFrom)?.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {trip.isFeatured && (
                        <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">推荐</span>
                      )}
                      {trip.isExclusive && (
                        <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">独家</span>
                      )}
                      {trip.isActive && (
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">上架</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <form action={toggleActive} className="inline">
                        <input type="hidden" name="id" value={trip.id} />
                        <input type="hidden" name="isActive" value={String(trip.isActive)} />
                        <button type="submit" className="text-xs text-blue-600 hover:underline">
                          {trip.isActive ? '下架' : '上架'}
                        </button>
                      </form>
                      <form action={toggleFeatured} className="inline">
                        <input type="hidden" name="id" value={trip.id} />
                        <input type="hidden" name="isFeatured" value={String(trip.isFeatured)} />
                        <button type="submit" className="text-xs text-yellow-600 hover:underline">
                          {trip.isFeatured ? '取消推荐' : '设为推荐'}
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/trips/${trip.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">
                        编辑
                      </Link>
                      <Link href={`/admin/trips/${trip.id}/itinerary`} className="text-purple-600 hover:text-purple-800 text-sm">
                        日程
                      </Link>
                      <form action={deleteTrip} className="inline">
                        <input type="hidden" name="id" value={trip.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={(e) => {
                            if (!confirm(`确定删除「${trip.titleCn}」？此操作不可恢复。`)) e.preventDefault();
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
