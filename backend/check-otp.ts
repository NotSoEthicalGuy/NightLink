import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const code = await prisma.emailVerification.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    if (code) {
        console.log(`LATEST_OTP_HASH_FOUND:${code.otpHash}:${code.email}`);
    } else {
        console.log('NO_CODE_FOUND');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
