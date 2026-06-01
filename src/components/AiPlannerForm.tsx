'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DESTINATIONS = [
  { value: 'japan', label: '日本', emoji: '🇯🇵' },
  { value: 'thailand', label: '泰国', emoji: '🇹🇭' },
  { value: 'france', label: '法国', emoji: '🇫🇷' },
  { value: 'italy', label: '意大利', emoji: '🇮🇹' },
  { value: 'australia', label: '澳大利亚', emoji: '🇦🇺' },
  { value: 'new-zealand', label: '新西兰', emoji: '🇳🇿' },
  { value: 'maldives', label: '马尔代夫', emoji: '🇲🇻' },
  { value: 'switzerland', label: '瑞士', emoji: '🇨🇭' },
];

const INTERESTS = [
  { value: 'culture', label: '文化探索', emoji: '🏛️' },
  { value: 'nature', label: '自然风光', emoji: '🏔️' },
  { value: 'food', label: '美食体验', emoji: '🍜' },
  { value: 'adventure', label: '冒险活动', emoji: '🏄' },
  { value: 'relaxation', label: '休闲度假', emoji: '🏖️' },
  { value: 'shopping', label: '购物', emoji: '🛍️' },
  { value: 'photography', label: '摄影', emoji: '📸' },
  { value: 'wildlife', label: '野生动物', emoji: '🦁' },
];

const TRAVELER_TYPES = [
  { value: 'couple', label: '情侣/夫妻', emoji: '💑' },
  { value: 'family', label: '家庭出行', emoji: '👨‍👩‍👧‍👦' },
  { value: 'solo', label: '独自旅行', emoji: '🧑' },
  { value: 'friends', label: '朋友同行', emoji: '👫' },
  { value: 'business', label: '商务出行', emoji: '💼' },
];

export default function AiPlannerForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    duration: 7,
    budget: '',
    travelerType: '',
    travelers: 2,
    interests: [] as string[],
    notes: '',
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`请求失败 (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
    } catch (err: any) {
      console.error('AI itinerary generation failed:', err);
      setError(err.message || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{result.title}</h2>
          <button
            onClick={() => { setResult(null); setStep(1); }}
            className="text-blue-600 hover:underline"
          >
            重新生成
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">总天数</p>
            <p className="text-2xl font-bold">{result.duration} 天</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">预估费用</p>
            <p className="text-2xl font-bold">{result.estimatedCost}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">出行人数</p>
            <p className="text-2xl font-bold">{result.travelers} 人</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">行程概述</h3>
          <p className="text-gray-600">{result.summary}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">每日行程</h3>
          <div className="space-y-4">
            {result.dailyPlan?.map((day: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-bold text-blue-600">Day {day.day}: {day.title}</h4>
                <p className="text-gray-600 mt-1">{day.description}</p>
                {day.highlights && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {day.highlights.map((h: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/contact')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            咨询此行程
          </button>
          <button
            onClick={() => { setResult(null); setStep(1); }}
            className="px-6 py-3 border rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            重新规划
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-100 h-2">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="p-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-bold">⚠️ {error}</p>
            <p className="text-sm mt-2">请检查网络连接或稍后重试</p>
          </div>
        )}

        {/* Step 1: Destination & Duration */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">选择目的地和行程天数</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">目的地</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DESTINATIONS.map(dest => (
                  <button
                    key={dest.value}
                    onClick={() => updateField('destination', dest.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.destination === dest.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{dest.emoji}</span>
                    <p className="mt-2 font-medium">{dest.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                行程天数: <span className="text-blue-600 font-bold">{formData.duration} 天</span>
              </label>
              <input
                type="range"
                min="3"
                max="21"
                value={formData.duration}
                onChange={e => updateField('duration', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3天</span>
                <span>21天</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.destination}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              下一步
            </button>
          </div>
        )}

        {/* Step 2: Budget & Travelers */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">预算和出行人数</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">预算范围（每人）</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '10000-20000', label: '¥1-2万' },
                  { value: '20000-50000', label: '¥2-5万' },
                  { value: '50000+', label: '¥5万+' },
                ].map(b => (
                  <button
                    key={b.value}
                    onClick={() => updateField('budget', b.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.budget === b.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">出行人数</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateField('travelers', Math.max(1, formData.travelers - 1))}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-8 text-center">{formData.travelers}</span>
                <button
                  onClick={() => updateField('travelers', formData.travelers + 1)}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 border py-3 rounded-xl font-bold hover:bg-gray-50">
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.budget}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Traveler Type & Interests */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">出行类型和兴趣偏好</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">出行类型</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TRAVELER_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => updateField('travelerType', type.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.travelerType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{type.emoji}</span>
                    <p className="mt-1 font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兴趣偏好（可多选）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.value}
                    onClick={() => toggleInterest(interest.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.interests.includes(interest.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{interest.emoji}</span>
                    <span className="ml-2">{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 border py-3 rounded-xl font-bold hover:bg-gray-50">
                上一步
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Notes & Submit */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">其他需求</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                特殊需求或备注（选填）
              </label>
              <textarea
                value={formData.notes}
                onChange={e => updateField('notes', e.target.value)}
                placeholder="例如：带老人出行、需要无障碍设施、素食需求..."
                className="w-full border rounded-xl p-4 h-32 resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-2">您的需求摘要</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">目的地:</span> {DESTINATIONS.find(d => d.value === formData.destination)?.emoji} {DESTINATIONS.find(d => d.value === formData.destination)?.label}</p>
                <p><span className="text-gray-500">天数:</span> {formData.duration} 天</p>
                <p><span className="text-gray-500">预算:</span> {formData.budget}</p>
                <p><span className="text-gray-500">人数:</span> {formData.travelers} 人</p>
                <p><span className="text-gray-500">出行类型:</span> {TRAVELER_TYPES.find(t => t.value === formData.travelerType)?.label}</p>
                <p><span className="text-gray-500">兴趣:</span> {formData.interests.length} 项</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="flex-1 border py-3 rounded-xl font-bold hover:bg-gray-50">
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> AI 生成中...
                  </span>
                ) : (
                  '✨ 生成行程方案'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
