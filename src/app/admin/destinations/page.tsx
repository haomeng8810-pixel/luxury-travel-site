import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ============================================
// Admin Destinations - List
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

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { trips: true } } },
  });

  const continentLabels: Record<string, string> = {
    Asia: '亚洲',
    Europe: '欧洲',
    Oceania: '大洋洲',
    Americas: '美洲',
    Africa: '非洲',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">目的地管理</h1>
        <Link
          href="/admin/destinations/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + 新增目的地
        </Link>
      </div>

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">洲</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">行程数</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{dest.name}</p>
                    <p className="text-sm text-gray-500">{dest.nameCn}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{continentLabels[dest.continent] || dest.continent}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dest._count.trips}</td>
                  <td className="px-6 py-4">
                    {dest.isActive ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">启用</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">停用</span>
                    )}
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
                            if (!confirm('确定删除此目的地？')) e.preventDefault();
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
