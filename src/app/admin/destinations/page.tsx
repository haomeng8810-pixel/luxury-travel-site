import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

// ============================================
// Admin Destinations - List with Search & Filter
// ============================================

async function deleteDestination(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.destination.delete({ where: { id } });
  revalidatePath('/admin/destinations');
}

async function toggleActive(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'true';
  await prisma.destination.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidatePath('/admin/destinations');
}

const continentLabels: Record<string, string> = {
  Asia: '亚洲',
  Europe: '欧洲',
  Oceania: '大洋洲',
  Americas: '美洲',
  Africa: '非洲',
};

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: { search?: string; continent?: string; featured?: string };
}) {
  const { search, continent, featured } = searchParams;

  const where: Prisma.DestinationWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameCn: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (continent) {
    where.continent = continent;
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  const [destinations, stats] = await Promise.all([
    prisma.destination.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { trips: true } } },
    }),
    prisma.destination.groupBy({
      by: ['continent'],
      _count: true,
    }),
  ]);

  const totalDestinations = await prisma.destination.count();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">目的地管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {totalDestinations} 个目的地，当前显示 {destinations.length} 个
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + 新增目的地
        </Link>
      </div>

      {/* Stats by Continent */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Object.entries(continentLabels).map(([key, label]) => {
          const count = stats.find(s => s.continent === key)?._count || 0;
          return (
            <Link
              key={key}
              href={continent === key ? '/admin/destinations' : `/admin/destinations?continent=${key}`}
              className={`bg-white rounded-lg shadow-sm p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors ${continent === key ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </Link>
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
              placeholder="搜索目的地名称、Slug..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">洲</label>
            <select name="continent" defaultValue={continent} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">全部</option>
              {Object.entries(continentLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" value="true" defaultChecked={featured === 'true'} />
              仅推荐
            </label>
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
            筛选
          </button>
          {(search || continent || featured) && (
            <Link href="/admin/destinations" className="text-sm text-blue-600 hover:underline">
              清除筛选
            </Link>
          )}
        </div>
      </form>

      {destinations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-400 mb-4">暂无目的地数据</p>
          <Link href="/admin/destinations/new" className="text-blue-600 hover:underline">
            创建第一个目的地 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">目的地</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">洲/区域</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">行程数</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{dest.nameCn}</p>
                    <p className="text-sm text-gray-500">{dest.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{dest.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {continentLabels[dest.continent] || dest.continent}
                    {dest.region && <span className="text-gray-400 ml-1">· {dest.region}</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Link href={`/admin/trips?destination=${dest.id}`} className="text-blue-600 hover:underline">
                      {dest._count.trips} 个行程 →
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {dest.isFeatured && (
                        <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">推荐</span>
                      )}
                      {dest.isActive ? (
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">启用</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800">停用</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/destinations/${dest.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">
                        编辑
                      </Link>
                      <form action={toggleActive} className="inline">
                        <input type="hidden" name="id" value={dest.id} />
                        <input type="hidden" name="isActive" value={String(dest.isActive)} />
                        <button type="submit" className="text-yellow-600 hover:text-yellow-800 text-sm">
                          {dest.isActive ? '停用' : '启用'}
                        </button>
                      </form>
                      <form action={deleteDestination} className="inline">
                        <input type="hidden" name="id" value={dest.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={(e) => {
                            if (!confirm(`确定删除「${dest.nameCn}」？此操作不可恢复。`)) e.preventDefault();
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
