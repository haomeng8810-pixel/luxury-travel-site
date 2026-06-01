import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

async function deletePodcast(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.podcast.delete({ where: { id } });
  revalidatePath('/admin/podcasts');
}

async function togglePublished(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isPublished = formData.get('isPublished') === 'true';
  await prisma.podcast.update({
    where: { id },
    data: { isPublished: !isPublished, publishedAt: !isPublished ? new Date() : null },
  });
  revalidatePath('/admin/podcasts');
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`;
}

export default async function AdminPodcastsPage({
  searchParams,
}: {
  searchParams: { search?: string; published?: string };
}) {
  const { search, published } = searchParams;

  const where: Prisma.PodcastWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (published === 'true') where.isPublished = true;
  if (published === 'false') where.isPublished = false;

  const [podcasts, totalPodcasts, publishedCount] = await Promise.all([
    prisma.podcast.findMany({ where, orderBy: [{ seasonNumber: 'desc' }, { episodeNumber: 'desc' }] }),
    prisma.podcast.count(),
    prisma.podcast.count({ where: { isPublished: true } }),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">播客管理</h1>
          <p className="text-gray-500 mt-1">共 {totalPodcasts} 期，已发布 {publishedCount} 期</p>
        </div>
        <Link href="/admin/podcasts/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 新增播客
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form className="flex gap-4">
          <input name="search" defaultValue={search} placeholder="搜索标题/描述..." className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]" />
          <select name="published" defaultValue={published} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部状态</option>
            <option value="true">已发布</option>
            <option value="false">未发布</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">筛选</button>
        </form>
      </div>

      {/* 播客列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">期数</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">时长</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">嘉宾</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {podcasts.map((podcast) => (
              <tr key={podcast.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">S{podcast.seasonNumber} E{podcast.episodeNumber}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{podcast.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[300px]">/{podcast.slug}</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{formatDuration(podcast.duration)}</td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px] truncate">{podcast.guests}</td>
                <td className="px-4 py-4">
                  <form method="POST" action={togglePublished} className="inline">
                    <input type="hidden" name="id" value={podcast.id} />
                    <input type="hidden" name="isPublished" value={String(podcast.isPublished)} />
                    <button type="submit" className={`px-2 py-1 text-xs rounded-full ${podcast.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {podcast.isPublished ? '已发布' : '草稿'}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/podcasts/${podcast.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">编辑</Link>
                  <form method="POST" action={deletePodcast} className="inline">
                    <input type="hidden" name="id" value={podcast.id} />
                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm" onClick={() => confirm('确定删除？')}>删除</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {podcasts.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无播客</div>
        )}
      </div>
    </div>
  );
}
