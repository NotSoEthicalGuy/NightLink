const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const TARGET_EMAIL = 'amin.kordab@gmail.com';

async function main() {
  const target = await prisma.tenant.findUnique({
    where: { email: TARGET_EMAIL },
    select: { id: true, email: true, role: true },
  });

  if (!target) {
    throw new Error(`Target user not found: ${TARGET_EMAIL}`);
  }

  const result = await prisma.$transaction([
    prisma.tenant.updateMany({
      where: { role: 'ADMIN', email: { not: TARGET_EMAIL } },
      data: { role: 'PR' },
    }),
    prisma.tenant.update({
      where: { email: TARGET_EMAIL },
      data: { role: 'ADMIN' },
      select: { email: true, role: true },
    }),
  ]);

  const demotedCount = result[0].count;
  const promoted = result[1];

  const admins = await prisma.tenant.findMany({
    where: { role: 'ADMIN' },
    select: { email: true, name: true, role: true },
    orderBy: { email: 'asc' },
  });

  console.log('Update complete.');
  console.log('Demoted previous admins:', demotedCount);
  console.log('Target admin:', promoted);
  console.log('Current admins:', admins);
}

main()
  .catch((error) => {
    console.error('Failed to set sole admin:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
