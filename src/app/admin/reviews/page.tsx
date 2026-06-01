import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';

async function deleteReview(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.review.delete({ where: { id } });
  revalidatePath('/admin/reviews');
}

async function toggleActive(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'true';
  await prisma.review.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidatePath('/admin/reviews');
}

async function toggleFeatured(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const isFeatured = formData.get('isFeatured') === 'true';
  await prisma.review.update({
    where: { id },
    data: { isFeatured: !isFeatured },
  });
  revalidatePath('/admin/reviews');
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { search?: string; featured?: string };
}) {
  const { search, featured } = searchParams;

  const where: Prisma.ReviewWhereInput = {};
  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (featured === 'true') where.isFeatured = true;

  const [reviews, totalReviews, avgRating, featuredCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { trip: { select: { titleCn: true } } },
    }),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.review.count({ where: { isFeatured: true } }),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评价管理</h1>
          <p className="text-gray-500 mt-1">共 {totalReviews} 条，平均评分 {(avgRating._avg.rating || 0).toFixed(1)}，推荐 {featuredCount} 条</p>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form className="flex gap-4">
          <input name="search" defaultValue={search} placeholder="搜索评价..." className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]" />
          <select name="featured" defaultValue={featured} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部</option>
            <option value="true">仅推荐</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">筛选</button>
        </form>
      </div>

      {/* 评价列表 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.customerName}</span>
                  <span className="text-sm text-gray-500">· {review.location}</span>
                  {review.isVerified && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">已验证</span>}
                </div>
                {review.trip && (
                  <div className="text-sm text-gray-500 mt-1">行程：{review.trip.titleCn}</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{review.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{review.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <form method="POST" action={toggleFeatured} className="inline">
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="isFeatured" value={String(review.isFeatured)} />
                  <button type="submit" className={`px-2 py-1 text-xs rounded-full ${review.isFeatured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                    {review.isFeatured ? '已推荐' : '设为推荐'}
                  </button>
                </form>
                <form method="POST" action={toggleActive} className="inline">
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="isActive" value={String(review.isActive)} />
                  <button type="submit" className={`px-2 py-1 text-xs rounded-full ${review.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {review.isActive ? '显示' : '隐藏'}
                  </button>
                </form>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                <form method="POST" action={deleteReview} className="inline">
                  <input type="hidden" name="id" value={review.id} />
                  <button type="submit" className="text-red-600 hover:text-red-800 text-sm" onClick={() => confirm('确定删除？')}>删除</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">暂无评价</div>
        )}
      </div>
    </div>
  );
}
