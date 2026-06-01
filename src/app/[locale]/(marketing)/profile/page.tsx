'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-2xl font-medium flex items-center justify-center">
              {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user?.name || '用户'}
              </h1>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">邮箱</p>
              <p className="font-medium">{session.user?.email}</p>
            </div>
            {session.user?.name && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">姓名</p>
                <p className="font-medium">{session.user?.name}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/my-inquiries')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              我的咨询
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
