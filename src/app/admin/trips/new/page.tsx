'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Process arrays
    const categories = (data.categories as string).split(',').map(s => s.trim()).filter(Boolean);
    const experiences = (data.experiences as string).split(',').map(s => s.trim()).filter(Boolean);
    const subDestinations = (data.subDestinations as string).split(',').map(s => s.trim()).filter(Boolean);
    const gallery = (data.gallery as string).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          categories,
          experiences,
          subDestinations,
          gallery,
          duration: Number(data.duration),
          nights: Number(data.nights),
          minGuests: Number(data.minGuests) || 2,
          sortOrder: Number(data.sortOrder) || 0,
          priceFrom: data.isInquireOnly ? undefined : Number(data.priceFrom),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '创建失败');
      }

      router.push('/admin/trips');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/trips" className="text-gray-500 hover:text-gray-700">
          ← 返回
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">新增行程</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6 max-w-2xl">
        {/* 基本信息 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 (英文) *</label>
              <input name="title" required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 (中文) *</label>
              <input name="titleCn" required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input name="slug" required placeholder="japan-zen-journey" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目的地 ID *</label>
              <input name="destinationId" required placeholder="dest-tokyo" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">情感 ID</label>
              <input name="emotionId" placeholder="emo-contentment" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
              <input name="coverImage" placeholder="https://..." className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
            <input name="subtitle" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">描述 (HTML)</label>
            <textarea name="description" rows={4} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        {/* 行程详情 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">行程详情</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">天数 *</label>
              <input name="duration" type="number" required defaultValue={7} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">晚数 *</label>
              <input name="nights" type="number" required defaultValue={6} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最少人数</label>
              <input name="minGuests" type="number" defaultValue={2} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
              <input name="sortOrder" type="number" defaultValue={0} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
              <select name="difficulty" className="w-full border rounded-lg px-3 py-2">
                <option value="Easy">简单</option>
                <option value="Moderate">中等</option>
                <option value="Hard">困难</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">活动强度</label>
              <select name="activityLevel" className="w-full border rounded-lg px-3 py-2">
                <option value="Relaxed">轻松</option>
                <option value="Moderate">适中</option>
                <option value="Active">活跃</option>
              </select>
            </div>
          </div>
        </div>

        {/* 价格 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">价格</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input type="checkbox" name="isInquireOnly" className="mr-2" />
                仅询价
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
              <input name="priceFrom" type="number" placeholder="38000" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">货币</label>
              <select name="priceCurrency" className="w-full border rounded-lg px-3 py-2">
                <option value="CNY">CNY</option>
                <option value="USD">USD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
        </div>

        {/* 标签 (逗号分隔) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">标签</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类 (逗号分隔)</label>
              <input name="categories" placeholder="Cultural, Wellness" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">体验 (逗号分隔)</label>
              <input name="experiences" placeholder="Temple Visit, Onsen" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">子目的地 (逗号分隔)</label>
              <input name="subDestinations" placeholder="东京, 京都" className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">图片库 URL (逗号分隔)</label>
            <input name="gallery" placeholder="https://..., https://..." className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        {/* 状态 */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked />
            <span className="text-sm">上架</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" />
            <span className="text-sm">推荐</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isExclusive" />
            <span className="text-sm">独家</span>
          </label>
        </div>

        {/* 提交 */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建行程'}
          </button>
          <Link href="/admin/trips" className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
