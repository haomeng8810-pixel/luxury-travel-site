const { PrismaClient } = require('@prisma/client');

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('DATABASE_URL not set');
    return;
  }
  console.log('URL format:', url.split('?')[0].replace(/:[^@]+@/, ':***@'));
  
  const prisma = new PrismaClient({
    datasources: { db: { url } },
  });
  
  try {
    await prisma.$connect();
    console.log('Connected!');
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables:', JSON.stringify(tables));
  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
