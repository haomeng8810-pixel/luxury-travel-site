'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destId = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    nameCn: '',
    nameLocal: '',
    continent: 'Asia',
    region: '',
    countryCode: '',
    description: '',
    coverImage: '',
    language: '',
    isActive: true,
    sortOrder: 0,
    highlight: '',
    gallery: '',
  });

  useEffect(() => {
    fetch(`/api/destinations/${destId}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          slug: data.slug,
          name: data.name,
          nameCn: data.nameCn,
          nameLocal: data.nameLocal || '',
          continent: data.continent,
          region: data.region || '',
          countryCode: data.countryCode || '',
          description: data.description || '',
          coverImage: data.coverImage || '',
          language: data.language || '',
          isActive: data.isActive,
          sortOrder: data.sortOrder || 0,
          highlight: Array.isArray(data.highlight) ? data.highlight.join(', ') : data.highlight || '',
          gallery: Array.isArray(data.gallery) ? data.gallery.join(', ') : data.gallery || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('加载失败');
        setLoading(false);
      });
  }, [destId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const highlight = formData.highlight.split(',').map(s => s.trim()).filter(Boolean);
    const gallery = formData.gallery.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/destinations/${destId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          highlight,
          gallery,
          sortOrder: Number(formData.sortOrder),
        }),
      });

      if (!res.ok) throw new Error('保存失败');

      router.push('/admin/destinations');
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
        <Link href="/admin/destinations" className="text-gray-500 hover:text-gray-700">← 返回</Link>
        <h1 className="text-3xl font-bold text-gray-900">编辑目的地</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称 (英文)</label>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称 (中文)</label>
            <input value={formData.nameCn} onChange={e => setFormData({ ...formData, nameCn: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本地名称</label>
            <input value={formData.nameLocal} onChange={e => setFormData({ ...formData, nameLocal: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">洲</label>
            <select value={formData.continent} onChange={e => setFormData({ ...formData, continent: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              <option value="Asia">亚洲</option>
              <option value="Europe">欧洲</option>
              <option value="Oceania">大洋洲</option>
              <option value="Americas">美洲</option>
              <option value="Africa">非洲</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">国家代码</label>
            <input value={formData.countryCode} onChange={e => setFormData({ ...formData, countryCode: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
            <input value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
            <input value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
          <input value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">亮点 (逗号分隔)</label>
          <input value={formData.highlight} onChange={e => setFormData({ ...formData, highlight: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图片库 (逗号分隔)</label>
          <input value={formData.gallery} onChange={e => setFormData({ ...formData, gallery: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
            <span className="text-sm">启用</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
            {saving ? '保存中...' : '保存'}
          </button>
          <Link href="/admin/destinations" className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</Link>
        </div>
      </form>
    </div>
  );
}
