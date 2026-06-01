// ============================================
// 目的地列表页 - Server Component
// 从数据库读取目的地数据
// ============================================

import { prisma } from '@/lib/prisma';
import DestinationsClient from './DestinationsClient';

async function getDestinations() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: [{ continent: 'asc' }, { sortOrder: 'asc' }],
    include: {
      _count: {
        select: { trips: true },
      },
    },
  });

  return destinations.map((dest: any) => ({
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    nameCn: dest.nameCn,
    nameJp: dest.nameLocal || dest.nameCn,
    coverImage: dest.coverImage,
    countryCode: dest.countryCode,
    continent: dest.continent,
    tripCount: dest._count?.trips || 0,
  }));
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return <DestinationsClient destinations={destinations} />;
}
