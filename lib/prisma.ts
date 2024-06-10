// prisma.ts

import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient with logging configuration
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Subscribe to query events and log query details
prisma.$on('query', async (e) => {
  console.log('SQL Query:', e.query);
  console.log('Parameters:', e.params);
});

export { prisma };
