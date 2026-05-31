'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDestinationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const highlight = (data.highlight as string).split(',').map(s => s.trim()).filter(Boolean);
    const gallery = (data.gallery as string).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          highlight,
          gallery,
          sortOrder: Number(data.sortOrder) || 0,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '创建失败');
      }

      router.push('/admin/destinations');
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
        <Link href="/admin/destinations" className="text-gray-500 hover:text-gray-700">← 返回</Link>
        <h1 className="text-3xl font-bold text-gray-900">新增目的地</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称 (英文) *</label>
            <input name="name" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称 (中文) *</label>
            <input name="nameCn" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input name="slug" required placeholder="tokyo" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本地名称</label>
            <input name="nameLocal" placeholder="東京" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">洲 *</label>
            <select name="continent" required className="w-full border rounded-lg px-3 py-2">
              <option value="Asia">亚洲</option>
              <option value="Europe">欧洲</option>
              <option value="Oceania">大洋洲</option>
              <option value="Americas">美洲</option>
              <option value="Africa">非洲</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">国家代码</label>
            <input name="countryCode" placeholder="JP" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
            <input name="region" placeholder="关东" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
            <input name="language" placeholder="日语" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea name="description" rows={3} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
          <input name="coverImage" placeholder="https://..." className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">亮点 (逗号分隔)</label>
          <input name="highlight" placeholder="浅草寺, 东京塔, 涩谷" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图片库 URL (逗号分隔)</label>
          <input name="gallery" placeholder="https://..., https://..." className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked />
            <span className="text-sm">启用</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
            {loading ? '创建中...' : '创建目的地'}
          </button>
          <Link href="/admin/destinations" className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</Link>
        </div>
      </form>
    </div>
  );
}
