import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function updateConfig(formData: FormData) {
  'use server';
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;
  await prisma.siteConfig.upsert({
    where: { key },
    create: { key, value, category: formData.get('category') as string || 'general' },
    update: { value },
  });
  revalidatePath('/admin/settings');
}

const categoryLabels: Record<string, string> = {
  general: '基本设置',
  contact: '联系方式',
  social: '社交媒体',
  seo: 'SEO 设置',
};

export default async function AdminSettingsPage() {
  const configs = await prisma.siteConfig.findMany({ orderBy: [{ category: 'asc' }, { key: 'asc' }] });

  const grouped = configs.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, typeof configs>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">网站设置</h1>
        <p className="text-gray-500 mt-1">管理网站基本配置、联系方式、社交媒体等</p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{categoryLabels[category] || category}</h2>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {items.map((config) => (
              <form key={config.key} method="POST" action={updateConfig} className="p-4 flex items-center gap-4">
                <div className="w-48">
                  <label className="text-sm font-medium text-gray-700">{config.key}</label>
                </div>
                <div className="flex-1">
                  <input
                    name="value"
                    defaultValue={config.value}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <input type="hidden" name="key" value={config.key} />
                <input type="hidden" name="category" value={config.category} />
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                  保存
                </button>
              </form>
            ))}
          </div>
        </div>
      ))}

      {/* 新增配置 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">新增配置项</h2>
        <form method="POST" action={updateConfig} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">键名 *</label>
              <input name="key" required placeholder="website_name" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">值 *</label>
              <input name="value" required placeholder="Apple Travel" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select name="category" defaultValue="general" className="w-full px-3 py-2 border rounded-lg">
                {Object.entries(categoryLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                新增
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
