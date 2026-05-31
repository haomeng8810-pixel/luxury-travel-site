import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ============================================
// Admin Inquiries - List
// ============================================

const statusLabels: Record<string, string> = {
  NEW: '新咨询',
  CONTACTED: '已联系',
  IN_PROGRESS: '处理中',
  QUOTED: '已报价',
  BOOKED: '已预订',
  CLOSED: '已关闭',
  LOST: '已流失',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  BOOKED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
};

async function updateStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await prisma.inquiry.update({
    where: { id },
    data: { status: status as any },
  });
  revalidatePath('/admin/inquiries');
}

async function deleteInquiry(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath('/admin/inquiries');
}

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">咨询管理</h1>
        <span className="text-sm text-gray-500">共 {inquiries.length} 条咨询</span>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-400">暂无咨询记录</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">客户</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">联系方式</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">留言</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{inq.name}</p>
                    {inq.guests && <p className="text-sm text-gray-500">{inq.guests}人</p>}
                    {inq.budget && <p className="text-sm text-gray-500">预算: ¥{inq.budget.toLocaleString()}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{inq.email}</p>
                    <p>{inq.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={inq.message || ''}>
                      {inq.message || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <form action={updateStatus} className="inline">
                      <input type="hidden" name="id" value={inq.id} />
                      <select
                        name="status"
                        defaultValue={inq.status}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${statusColors[inq.status]}`}
                        onChange={(e) => e.target.form?.requestSubmit()}
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteInquiry} className="inline">
                      <input type="hidden" name="id" value={inq.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={(e) => {
                          if (!confirm('确定删除此咨询？')) e.preventDefault();
                        }}
                      >
                        删除
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
