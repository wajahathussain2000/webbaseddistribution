import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Vercel Cron Jobs send a specific authorization header. 
    // Secure this route using CRON_SECRET environment variable in Vercel.
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19); 
    const backupName = `db_distributionweb_${dateStr}.bak`;

    console.log(`Starting Vercel Cron Backup: ${backupName}`);
    
    // Execute raw SQL for backup (saves to default SQL Server backup directory)
    await prisma.$executeRawUnsafe(`BACKUP DATABASE [db_distributionweb] TO DISK = '${backupName}' WITH NOFORMAT, NOINIT, NAME = 'db_distributionweb-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10`);

    console.log(`Backup completed successfully: ${backupName}`);
    return NextResponse.json({ success: true, message: `Backup ${backupName} completed successfully.` });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json({ success: false, error: "Backup failed" }, { status: 500 });
  }
}
