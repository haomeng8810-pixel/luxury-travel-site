import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

const typeLabels: Record<string, string> = {
  STORY: '故事',
  GUIDE: '攻略',
  NEWS: '资讯',
  TIPS: '贴士',
};

async function deleteArticle(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.article.delete({ where: { id } });
  revalidatePath('/admin/articles');
}

async function togglePublished(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isPublished = formData.get('isPublished') === 'true';
  await prisma.article.update({
    where: { id },
    data: { isPublished: !isPublished, publishedAt: !isPublished ? new Date() : null },
  });
  revalidatePath('/admin/articles');
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; published?: string };
}) {
  const { search, type, published } = searchParams;

  const where: Prisma.ArticleWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { titleCn: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (type) where.type = type as any;
  if (published === 'true') where.isPublished = true;
  if (published === 'false') where.isPublished = false;

  const [articles, stats] = await Promise.all([
    prisma.article.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.article.groupBy({ by: ['type'], _count: true }),
  ]);

  const totalArticles = await prisma.article.count();
  const publishedCount = await prisma.article.count({ where: { isPublished: true } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-500 mt-1">共 {totalArticles} 篇，已发布 {publishedCount} 篇</p>
        </div>
        <Link href="/admin/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 新建文章
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form className="flex gap-4 flex-wrap">
          <input name="search" defaultValue={search} placeholder="搜索标题..." className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]" />
          <select name="type" defaultValue={type} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部类型</option>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select name="published" defaultValue={published} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部状态</option>
            <option value="true">已发布</option>
            <option value="false">未发布</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">筛选</button>
        </form>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.type} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold">{s._count}</div>
            <div className="text-sm text-gray-500">{typeLabels[s.type] || s.type}</div>
          </div>
        ))}
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{article.titleCn || article.title}</div>
                  <div className="text-sm text-gray-500">/{article.slug}</div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{typeLabels[article.type] || article.type}</span>
                </td>
                <td className="px-4 py-4">
                  <form method="POST" action={togglePublished} className="inline">
                    <input type="hidden" name="id" value={article.id} />
                    <input type="hidden" name="isPublished" value={String(article.isPublished)} />
                    <button type="submit" className={`px-2 py-1 text-xs rounded-full ${article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {article.isPublished ? '已发布' : '草稿'}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString('zh-CN')}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/articles/${article.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">编辑</Link>
                  <form method="POST" action={deleteArticle} className="inline">
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm" onClick={() => confirm('确定删除？')}>删除</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无文章</div>
        )}
      </div>
    </div>
  );
}
