const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^:]+)@/, ':***@'));
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    console.log('Tables found:', tables);
    
    if (tables.length === 0) {
      console.log('\n❌ No tables found! You need to run: npx prisma db push');
    } else {
      // Try querying each table
      const tableNames = tables.map(t => t.table_name);
      for (const table of tableNames) {
        try {
          const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "${table}"`);
          console.log(`  ${table}: ${count[0].count} rows`);
        } catch (e) {
          console.log(`  ${table}: error querying - ${e.message}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
