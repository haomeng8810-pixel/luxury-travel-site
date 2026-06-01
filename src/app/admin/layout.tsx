import { ReactNode } from 'react';
import Link from 'next/link';

// ============================================
// Admin Layout
// ============================================

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Luxury Travel Admin
            </Link>
            <nav className="flex space-x-6 overflow-x-auto">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                📊 仪表盘
              </Link>
              <Link href="/admin/trips" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                🗺️ 行程管理
              </Link>
              <Link href="/admin/destinations" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                📍 目的地
              </Link>
              <Link href="/admin/articles" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                📝 文章管理
              </Link>
              <Link href="/admin/experts" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                👤 旅行专家
              </Link>
              <Link href="/admin/reviews" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                ⭐ 评价管理
              </Link>
              <Link href="/admin/podcasts" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                🎙️ 播客管理
              </Link>
              <Link href="/admin/emotions" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                💭 情感标签
              </Link>
              <Link href="/admin/inquiries" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                📩 咨询管理
              </Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                ⚙️ 网站设置
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
