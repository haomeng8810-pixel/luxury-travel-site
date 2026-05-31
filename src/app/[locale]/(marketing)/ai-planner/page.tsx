import { getTranslations } from 'next-intl/server';
import AiPlannerForm from '@/components/AiPlannerForm';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'aiPlanner' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function AiPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="text-xl">✨</span>
              AI 智能行程规划
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              让 AI 为您定制
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 专属旅程</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              告诉我们您的旅行偏好，AI 将在几秒钟内为您生成个性化的行程方案
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AiPlannerForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-2">智能匹配</h3>
              <p className="text-gray-600">基于您的偏好和目的地特色，AI 智能推荐最佳行程</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">秒级生成</h3>
              <p className="text-gray-600">输入需求后，AI 在几秒钟内生成完整的行程方案</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">预算透明</h3>
              <p className="text-gray-600">自动生成详细预算估算，让旅行规划更轻松</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
