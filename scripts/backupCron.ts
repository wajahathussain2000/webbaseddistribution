import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

async function runBackup() {
    try {
        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19); 
        const backupName = `db_distributionweb_${dateStr}.bak`;

        console.log(`[${new Date().toISOString()}] Starting backup: ${backupName}...`);
        
        // Execute raw SQL for backup (saves to default SQL Server backup directory)
        await prisma.$executeRawUnsafe(`BACKUP DATABASE [db_distributionweb] TO DISK = '${backupName}' WITH NOFORMAT, NOINIT, NAME = 'db_distributionweb-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10`);

        console.log(`[${new Date().toISOString()}] Backup completed successfully: ${backupName}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Backup failed:`, error);
    }
}

// Schedule task to run every 3 hours
cron.schedule('0 */3 * * *', () => {
    runBackup();
});

console.log("Database Backup Scheduler started.");
console.log("A backup of 'db_distributionweb' will be saved to the SQL Server's default backup directory every 3 hours.");
