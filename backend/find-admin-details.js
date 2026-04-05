const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const adminUser = await prisma.tenant.findFirst({
        where: { role: 'ADMIN' }
    });
    if (adminUser) {
        console.log('Admin Email:', adminUser.email);
        console.log('Admin Slug:', adminUser.slug);
        console.log('Admin Name:', adminUser.name);
    } else {
        console.log('No admin user found.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
