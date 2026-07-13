import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { DOCUMENTS } from "./seed-documents";
import { SITE_CONTENT } from "./seed-site-content";

const prisma = new PrismaClient();

async function main() {
  // --- Admin account -------------------------------------------------------
  const email = (process.env.ADMIN_EMAIL ?? "admin@jdesk.dev").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  const name = process.env.ADMIN_NAME ?? "JDesk Admin";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name, role: "admin" },
  });
  console.log(`✓ admin: ${email}`);

  // --- Documents -----------------------------------------------------------
  for (const doc of DOCUMENTS) {
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: doc,
      create: doc,
    });
  }
  console.log(`✓ documents: ${DOCUMENTS.length}`);

  // --- Site content (interface) -------------------------------------------
  for (const [key, value] of Object.entries(SITE_CONTENT)) {
    const serialized = JSON.stringify(value);
    await prisma.siteContent.upsert({
      where: { key },
      update: { value: serialized },
      create: { key, value: serialized },
    });
  }
  console.log(`✓ site content: ${Object.keys(SITE_CONTENT).join(", ")}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
