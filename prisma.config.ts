import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/database/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/database/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
