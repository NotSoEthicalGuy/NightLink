const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const email = 'amin.kordab@gmail.com';
    const password = 'admin';
    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.tenant.update({
        where: { email },
        data: { passwordHash }
    });
    
    console.log(`Password for ${email} reset to: ${password}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
