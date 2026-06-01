'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('创建失败');
      router.push('/admin/articles');
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
        <Link href="/admin/articles" className="text-gray-500 hover:text-gray-700">← 返回</Link>
        <h1 className="text-2xl font-bold text-gray-900">新建文章</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">英文标题 *</label>
            <input name="title" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">中文标题</label>
            <input name="titleCn" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input name="slug" required placeholder="my-article-slug" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">类型</label>
              <select name="type" defaultValue="STORY" className="w-full px-3 py-2 border rounded-lg">
                <option value="STORY">故事</option>
                <option value="GUIDE">攻略</option>
                <option value="NEWS">资讯</option>
                <option value="TIPS">贴士</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <input name="categories" defaultValue="[]" placeholder='["日本","文化"]' className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">封面图 URL</label>
            <input name="coverImage" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">副标题</label>
            <input name="subtitle" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">内容</label>
            <textarea name="content" rows={10} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">作者</label>
              <input name="author" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">阅读时间（分钟）</label>
              <input name="readTime" type="number" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">标签</label>
            <input name="tags" defaultValue="[]" placeholder='["温泉","东京"]' className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input name="isFeatured" type="checkbox" className="rounded" />
              <span className="text-sm">推荐</span>
            </label>
            <label className="flex items-center gap-2">
              <input name="isPublished" type="checkbox" className="rounded" />
              <span className="text-sm">立即发布</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? '创建中...' : '创建文章'}
          </button>
          <Link href="/admin/articles" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">取消</Link>
        </div>
      </form>
    </div>
  );
}
