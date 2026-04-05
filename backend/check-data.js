const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const eventCount = await prisma.event.count();
    const reservationCount = await prisma.reservation.count();
    const tenantCount = await prisma.tenant.count();
    console.log(JSON.stringify({ eventCount, reservationCount, tenantCount }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
