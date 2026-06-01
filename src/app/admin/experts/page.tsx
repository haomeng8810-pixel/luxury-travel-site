import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

async function deleteExpert(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.travelExpert.delete({ where: { id } });
  revalidatePath('/admin/experts');
}

async function toggleAvailable(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isAvailable = formData.get('isAvailable') === 'true';
  await prisma.travelExpert.update({
    where: { id },
    data: { isAvailable: !isAvailable },
  });
  revalidatePath('/admin/experts');
}

export default async function AdminExpertsPage({
  searchParams,
}: {
  searchParams: { search?: string; available?: string };
}) {
  const { search, available } = searchParams;

  const where: Prisma.TravelExpertWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { title: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (available === 'true') where.isAvailable = true;
  if (available === 'false') where.isAvailable = false;

  const [experts, totalExperts, availableCount] = await Promise.all([
    prisma.travelExpert.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.travelExpert.count(),
    prisma.travelExpert.count({ where: { isAvailable: true } }),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">旅行专家管理</h1>
          <p className="text-gray-500 mt-1">共 {totalExperts} 人，可接单 {availableCount} 人</p>
        </div>
        <Link href="/admin/experts/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 新增专家
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form className="flex gap-4">
          <input name="search" defaultValue={search} placeholder="搜索姓名/职位..." className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]" />
          <select name="available" defaultValue={available} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部状态</option>
            <option value="true">可接单</option>
            <option value="false">不可接单</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">筛选</button>
        </form>
      </div>

      {/* 专家列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">专家</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">专长</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">语言</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">经验</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {experts.map((expert) => (
              <tr key={expert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{expert.name}</div>
                  <div className="text-sm text-gray-500">{expert.title}</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px] truncate">{expert.specialties}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{expert.languages}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{expert.yearsExperience} 年</td>
                <td className="px-4 py-4">
                  <form method="POST" action={toggleAvailable} className="inline">
                    <input type="hidden" name="id" value={expert.id} />
                    <input type="hidden" name="isAvailable" value={String(expert.isAvailable)} />
                    <button type="submit" className={`px-2 py-1 text-xs rounded-full ${expert.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {expert.isAvailable ? '可接单' : '不可接单'}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/experts/${expert.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">编辑</Link>
                  <form method="POST" action={deleteExpert} className="inline">
                    <input type="hidden" name="id" value={expert.id} />
                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm" onClick={() => confirm('确定删除？')}>删除</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {experts.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无旅行专家</div>
        )}
      </div>
    </div>
  );
}
