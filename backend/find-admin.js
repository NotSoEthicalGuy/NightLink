const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const adminUser = await prisma.tenant.findFirst({
        where: { role: 'ADMIN' }
    });
    if (adminUser) {
        console.log('Admin found:', adminUser.email);
    } else {
        console.log('No admin user found.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
