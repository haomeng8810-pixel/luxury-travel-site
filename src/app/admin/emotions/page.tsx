import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

async function deleteEmotion(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.emotion.delete({ where: { id } });
  revalidatePath('/admin/emotions');
}

async function toggleActive(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'true';
  await prisma.emotion.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidatePath('/admin/emotions');
}

export default async function AdminEmotionsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { search } = searchParams;

  const where: Prisma.EmotionWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameCn: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [emotions, totalEmotions] = await Promise.all([
    prisma.emotion.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { trips: true } } },
    }),
    prisma.emotion.count(),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">情感标签管理</h1>
          <p className="text-gray-500 mt-1">共 {totalEmotions} 个情感标签</p>
        </div>
        {/* TODO: 新增情感标签功能 */}
      </div>

      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form className="flex gap-4">
          <input name="search" defaultValue={search} placeholder="搜索情感名称..." className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]" />
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">筛选</button>
        </form>
      </div>

      {/* 情感标签列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotions.map((emotion) => (
          <div key={emotion.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: emotion.color }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emotion.icon || '💭'}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{emotion.nameCn}</h3>
                  <p className="text-sm text-gray-500">{emotion.name}</p>
                </div>
              </div>
              <form method="POST" action={toggleActive} className="inline">
                <input type="hidden" name="id" value={emotion.id} />
                <input type="hidden" name="isActive" value={String(emotion.isActive)} />
                <button type="submit" className={`px-2 py-1 text-xs rounded-full ${emotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {emotion.isActive ? '启用' : '禁用'}
                </button>
              </form>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{emotion.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">关联行程：{emotion._count.trips} 个</span>
              <div className="flex gap-2">
                <Link href={`/admin/emotions/${emotion.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">编辑</Link>
                <form method="POST" action={deleteEmotion} className="inline">
                  <input type="hidden" name="id" value={emotion.id} />
                  <button type="submit" className="text-red-600 hover:text-red-800 text-sm" onClick={() => confirm('确定删除？')}>删除</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
      {emotions.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">暂无情感标签</div>
      )}
    </div>
  );
}
