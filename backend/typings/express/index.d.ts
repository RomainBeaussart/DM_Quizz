declare namespace Express {
    interface Request {
        userId: string
        prisma: import('../../prisma/generated/prisma-client').Prisma
    }
}
