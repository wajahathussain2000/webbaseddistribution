import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        await prisma.$executeRawUnsafe('CREATE DATABASE backup_distributionweb;');
        console.log('Database backup_distributionweb created successfully.');
    } catch (e) {
        console.error('Error creating database:', e);
    }
}
main().finally(() => prisma.$disconnect());
