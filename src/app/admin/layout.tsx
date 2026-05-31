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
            <nav className="flex space-x-8">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/trips" className="text-gray-600 hover:text-gray-900">
                行程管理
              </Link>
              <Link href="/admin/inquiries" className="text-gray-600 hover:text-gray-900">
                咨询管理
              </Link>
              <Link href="/admin/destinations" className="text-gray-600 hover:text-gray-900">
                目的地管理
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
