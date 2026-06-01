'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPodcastPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Parse duration from "HH:MM" or "MM" format to seconds
    let durationSeconds = 0;
    const dur = data.duration as string;
    if (dur.includes(':')) {
      const [h, m] = dur.split(':').map(Number);
      durationSeconds = (h || 0) * 3600 + (m || 0) * 60;
    } else {
      durationSeconds = Number(dur) * 60; // assume minutes
    }

    try {
      const res = await fetch('/api/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          duration: durationSeconds,
          episodeNumber: Number(data.episodeNumber),
          seasonNumber: Number(data.seasonNumber) || 1,
        }),
      });
      if (!res.ok) throw new Error('创建失败');
      router.push('/admin/podcasts');
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
        <Link href="/admin/podcasts" className="text-gray-500 hover:text-gray-700">← 返回</Link>
        <h1 className="text-2xl font-bold text-gray-900">新增播客</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题 *</label>
              <input name="title" required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input name="slug" required placeholder="episode-1-japan-culture" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">描述 *</label>
            <textarea name="description" required rows={3} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">季数</label>
              <input name="seasonNumber" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">集数 *</label>
              <input name="episodeNumber" type="number" required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">时长 (分钟)</label>
              <input name="duration" placeholder="30" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">封面图 URL</label>
            <input name="coverImage" placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">音频 URL</label>
            <input name="audioUrl" placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">嘉宾</label>
            <input name="guests" placeholder="张三, 李四" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">文字稿</label>
            <textarea name="transcript" rows={5} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <label className="flex items-center gap-2">
            <input name="isPublished" type="checkbox" className="rounded" />
            <span className="text-sm">立即发布</span>
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? '创建中...' : '创建播客'}
          </button>
          <Link href="/admin/podcasts" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">取消</Link>
        </div>
      </form>
    </div>
  );
}
