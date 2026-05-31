'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ItineraryDay {
  day: number;
  title: string;
  titleCn: string;
  description: string;
  location?: string;
  accommodation?: string;
  meals?: string[];
  activities?: string[];
}

export default function EditTripItineraryPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/trips/${tripId}`)
      .then(res => res.json())
      .then(data => {
        setTripTitle(data.titleCn);
        try {
          const parsed = data.itinerary ? JSON.parse(data.itinerary) : [];
          setItinerary(Array.isArray(parsed) ? parsed : []);
        } catch {
          setItinerary([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('加载失败');
        setLoading(false);
      });
  }, [tripId]);

  function addDay() {
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: `Day ${itinerary.length + 1}`,
      titleCn: `第 ${itinerary.length + 1} 天`,
      description: '',
      location: '',
      accommodation: '',
      meals: [],
      activities: [],
    };
    setItinerary([...itinerary, newDay]);
    setEditingDay(newDay.day);
  }

  function removeDay(dayNum: number) {
    const updated = itinerary.filter(d => d.day !== dayNum).map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(updated);
    setEditingDay(null);
  }

  function updateDay(dayNum: number, field: keyof ItineraryDay, value: any) {
    setItinerary(itinerary.map(d => d.day === dayNum ? { ...d, [field]: value } : d));
  }

  function parseArrayField(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  async function saveItinerary() {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary }),
      });

      if (!res.ok) throw new Error('保存失败');

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">编辑行程日程</h1>
          <p className="text-sm text-gray-500">{tripTitle}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      {/* Day List */}
      <div className="space-y-3 mb-6">
        {itinerary.map((day) => (
          <div key={day.day} className="bg-white rounded-lg shadow-sm border">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setEditingDay(editingDay === day.day ? null : day.day)}
            >
              <div className="flex items-center gap-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Day {day.day}
                </span>
                <span className="font-medium">{day.titleCn}</span>
                {day.location && (
                  <span className="text-sm text-gray-500">📍 {day.location}</span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeDay(day.day); }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                删除
              </button>
            </div>

            {editingDay === day.day && (
              <div className="px-6 pb-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标题 (英文)</label>
                    <input
                      value={day.title}
                      onChange={e => updateDay(day.day, 'title', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标题 (中文)</label>
                    <input
                      value={day.titleCn}
                      onChange={e => updateDay(day.day, 'titleCn', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
                  <input
                    value={day.location || ''}
                    onChange={e => updateDay(day.day, 'location', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={day.description}
                    onChange={e => updateDay(day.day, 'description', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">住宿</label>
                  <input
                    value={day.accommodation || ''}
                    onChange={e => updateDay(day.day, 'accommodation', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">餐食 (每行一个)</label>
                    <textarea
                      value={(day.meals || []).join('\n')}
                      onChange={e => updateDay(day.day, 'meals', parseArrayField(e.target.value))}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="早餐&#10;午餐&#10;晚餐"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">活动 (每行一个)</label>
                    <textarea
                      value={(day.activities || []).join('\n')}
                      onChange={e => updateDay(day.day, 'activities', parseArrayField(e.target.value))}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="参观浅草寺&#10;体验茶道"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={addDay} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          + 添加一天
        </button>
        <button
          onClick={saveItinerary}
          disabled={saving || itinerary.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存日程'}
        </button>
        <Link href="/admin/trips" className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</Link>
      </div>

      {itinerary.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          暂无日程，点击「添加一天」开始编辑
        </div>
      )}
    </div>
  );
}
