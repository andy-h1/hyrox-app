import "dotenv/config"
import type { PrismaConfig } from "prisma/config";

export default {
  migrations: {
    seed: `tsx prisma/seed.ts`,
  },
} satisfies PrismaConfig;