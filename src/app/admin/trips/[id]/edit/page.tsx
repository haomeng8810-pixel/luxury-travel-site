'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    titleCn: '',
    subtitle: '',
    tagline: '',
    description: '',
    coverImage: '',
    duration: 7,
    nights: 6,
    minGuests: 2,
    difficulty: 'Easy',
    activityLevel: 'Relaxed',
    emotionId: '',
    destinationId: '',
    priceFrom: '',
    priceCurrency: 'CNY',
    priceNote: '',
    isInquireOnly: false,
    isFeatured: false,
    isExclusive: false,
    isActive: true,
    sortOrder: 0,
    categories: '',
    experiences: '',
    subDestinations: '',
    gallery: '',
  });

  useEffect(() => {
    fetch(`/api/trips/${tripId}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          slug: data.slug,
          title: data.title,
          titleCn: data.titleCn,
          subtitle: data.subtitle || '',
          tagline: data.tagline || '',
          description: data.description || '',
          coverImage: data.coverImage || '',
          duration: data.duration,
          nights: data.nights,
          minGuests: data.minGuests || 2,
          difficulty: data.difficulty || 'Easy',
          activityLevel: data.activityLevel || 'Relaxed',
          emotionId: data.emotionId || '',
          destinationId: data.destinationId || '',
          priceFrom: data.priceFrom || '',
          priceCurrency: data.priceCurrency || 'CNY',
          priceNote: data.priceNote || '',
          isInquireOnly: data.isInquireOnly || false,
          isFeatured: data.isFeatured || false,
          isExclusive: data.isExclusive || false,
          isActive: data.isActive,
          sortOrder: data.sortOrder || 0,
          categories: Array.isArray(data.categories) ? data.categories.join(', ') : data.categories || '',
          experiences: Array.isArray(data.experiences) ? data.experiences.join(', ') : data.experiences || '',
          subDestinations: Array.isArray(data.subDestinations) ? data.subDestinations.join(', ') : data.subDestinations || '',
          gallery: Array.isArray(data.gallery) ? data.gallery.join(', ') : data.gallery || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('加载失败');
        setLoading(false);
      });
  }, [tripId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const categories = formData.categories.split(',').map(s => s.trim()).filter(Boolean);
    const experiences = formData.experiences.split(',').map(s => s.trim()).filter(Boolean);
    const subDestinations = formData.subDestinations.split(',').map(s => s.trim()).filter(Boolean);
    const gallery = formData.gallery.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categories,
          experiences,
          subDestinations,
          gallery,
          duration: Number(formData.duration),
          nights: Number(formData.nights),
          minGuests: Number(formData.minGuests),
          priceFrom: formData.isInquireOnly ? undefined : Number(formData.priceFrom) || undefined,
          sortOrder: Number(formData.sortOrder),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '保存失败');
      }

      router.push('/admin/trips');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/trips" className="text-gray-500 hover:text-gray-700">← 返回</Link>
        <h1 className="text-3xl font-bold text-gray-900">编辑行程</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 (英文) *</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 (中文) *</label>
              <input value={formData.titleCn} onChange={e => setFormData({ ...formData, titleCn: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目的地 ID *</label>
              <input value={formData.destinationId} onChange={e => setFormData({ ...formData, destinationId: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">情感 ID</label>
              <input value={formData.emotionId} onChange={e => setFormData({ ...formData, emotionId: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
              <input value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
            <input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">描述 (HTML)</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">行程详情</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">天数</label>
              <input type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">晚数</label>
              <input type="number" value={formData.nights} onChange={e => setFormData({ ...formData, nights: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最少人数</label>
              <input type="number" value={formData.minGuests} onChange={e => setFormData({ ...formData, minGuests: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
              <input type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
              <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="Easy">简单</option>
                <option value="Moderate">中等</option>
                <option value="Hard">困难</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">活动强度</label>
              <select value={formData.activityLevel} onChange={e => setFormData({ ...formData, activityLevel: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="Relaxed">轻松</option>
                <option value="Moderate">适中</option>
                <option value="Active">活跃</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">价格</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isInquireOnly} onChange={e => setFormData({ ...formData, isInquireOnly: e.target.checked })} />
                <span className="text-sm">仅询价</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
              <input type="number" value={formData.priceFrom} onChange={e => setFormData({ ...formData, priceFrom: e.target.value })} disabled={formData.isInquireOnly} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">货币</label>
              <select value={formData.priceCurrency} onChange={e => setFormData({ ...formData, priceCurrency: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="CNY">CNY</option>
                <option value="USD">USD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">标签 (逗号分隔)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <input value={formData.categories} onChange={e => setFormData({ ...formData, categories: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">体验</label>
              <input value={formData.experiences} onChange={e => setFormData({ ...formData, experiences: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">子目的地</label>
              <input value={formData.subDestinations} onChange={e => setFormData({ ...formData, subDestinations: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">图片库 URL (逗号分隔)</label>
            <input value={formData.gallery} onChange={e => setFormData({ ...formData, gallery: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
            <span className="text-sm">上架</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} />
            <span className="text-sm">推荐</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isExclusive} onChange={e => setFormData({ ...formData, isExclusive: e.target.checked })} />
            <span className="text-sm">独家</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
            {saving ? '保存中...' : '保存'}
          </button>
          <Link href="/admin/trips" className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</Link>
        </div>
      </form>
    </div>
  );
}
