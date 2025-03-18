import ws from 'ws';
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';

// Configure Neon to use WebSockets in environments that require it (like Edge)
neonConfig.webSocketConstructor = ws;

// Define the singleton
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || '';
  
  // For Neon Postgres with Prisma
  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });
};

// Type for global
type PrismaGlobal = {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

// Create global variable
const globalForPrisma = globalThis as unknown as PrismaGlobal;

// Create and export the Prisma instance
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Assign to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;