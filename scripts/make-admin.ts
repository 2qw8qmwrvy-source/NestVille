import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/make-admin.ts <email>");
  process.exit(1);
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

async function main() {
  const existing = await db.user.findUnique({ where: { email } });
  if (!existing) {
    console.error(`No user found with email ${email}`);
    process.exitCode = 1;
    return;
  }

  const user = await db.user.update({
    where: { email },
    data: { isAdmin: true },
  });
  console.log(`${user.name} (${user.email}) is now an admin.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
