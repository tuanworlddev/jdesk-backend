// Pulls the file-based standalone docs (content/docs/*.md in the frontend)
// into the DB so every document lives in one place and is editable in the
// admin. The default mode upserts by slug. Pass --create-only during deploys
// to publish newly added docs without overwriting later CMS edits.

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

// Metadata mirrors app/docs/standalone-docs.ts. Order continues after the
// seeded core docs within each group.
const STANDALONE: {
  slug: string;
  title: string;
  description: string;
  group: string;
  order: number;
}[] = [
  { slug: "networked-real-time", title: "Networked & real-time apps", description: "Connect JDesk applications to WebSocket, SSE, and other real-time services without blocking the UI thread.", group: "Guides", order: 8 },
  { slug: "storing-secrets", title: "Store secrets", description: "Store credentials with the operating system credential store instead of local files or browser storage.", group: "Guides", order: 9 },
  { slug: "dialogs-printing", title: "Dialogs & printing", description: "Open native file dialogs, message dialogs, and print the current WebView document.", group: "Guides", order: 10 },
  { slug: "automation-e2e", title: "Automation & E2E", description: "Drive a JDesk application through the opt-in automation module for end-to-end tests and CI.", group: "Guides", order: 11 },
  { slug: "updating-applications", title: "Updating applications", description: "Coordinate signed application updates with health checks and rollback.", group: "Guides", order: 12 },
  { slug: "enterprise-policy", title: "Enterprise managed policy", description: "Restrict runtime features through a centrally managed policy file.", group: "Guides", order: 13 },
  { slug: "diagnostics-support", title: "Diagnostics & support", description: "Create bounded, redacted support bundles for troubleshooting production applications.", group: "Guides", order: 14 },
  { slug: "managing-windows", title: "Managing windows", description: "Create, configure, show, hide, navigate, and close application windows safely.", group: "Guides", order: 15 },
  { slug: "choosing-frontend", title: "Choosing a frontend", description: "Choose between plain HTML, React, Vue, and Svelte for a JDesk user interface.", group: "Guides", order: 16 },
  { slug: "typescript-bindings", title: "TypeScript bindings", description: "Generate a typed browser client from Java command records at compile time.", group: "Guides", order: 17 },
  { slug: "signing-distributing", title: "Signing & distributing", description: "Sign, notarize, verify, and publish native JDesk application packages.", group: "Guides", order: 18 },
  { slug: "threading-event-loop", title: "Threading & event loop", description: "Understand UI dispatch, virtual-thread command handlers, events, and backpressure.", group: "Concepts", order: 3 },
  { slug: "native-memory-ffm", title: "Native memory & FFM", description: "Understand how JDesk uses Java's Foreign Function & Memory API to call platform WebViews.", group: "Concepts", order: 4 },
  { slug: "gradle-plugin", title: "Gradle plugin", description: "Configure development, bindings, packaging, installers, and diagnostics through dev.jdesk.application.", group: "Reference", order: 1 },
  { slug: "protocol", title: "IPC protocol", description: "The exact versioned JSON envelope and processing rules used across the JDesk bridge.", group: "Reference", order: 2 },
  { slug: "capabilities-json", title: "Capabilities JSON", description: "Reference for the versioned, deny-by-default per-window capability policy.", group: "Reference", order: 3 },
  { slug: "error-codes", title: "Error codes", description: "Stable public error codes returned by the runtime, bridge, asset server, and tooling.", group: "Reference", order: 4 },
  { slug: "typescript-client", title: "TypeScript client", description: "Reference for invoke, events, cancellation, reset, and binary streams in @jdesk/client.", group: "Reference", order: 5 },
  { slug: "plugins", title: "Plugins", description: "Extend an app with signed, integrity-checked, capability-gated third-party plugins.", group: "Guides", order: 19 },
  { slug: "non-modular-libraries", title: "Using non-modular libraries", description: "Use automatic-module Java libraries (like LSP4J) in a JPMS app for both dev and packaging.", group: "Guides", order: 20 },
  { slug: "webview-sessions", title: "WebView sessions & cookies", description: "Isolate browser sessions and manage cookies, cache, local storage, and user agents across native WebViews.", group: "Guides", order: 21 },
];

const CONTENT_DIR = path.join(
  process.cwd(),
  "..",
  "frontend",
  "content",
  "docs",
);

async function main() {
  const createOnly = process.argv.includes("--create-only");
  let imported = 0;
  let skipped = 0;
  for (const doc of STANDALONE) {
    let content = "";
    try {
      content = readFileSync(path.join(CONTENT_DIR, `${doc.slug}.md`), "utf8");
    } catch {
      console.warn(`  skip ${doc.slug} (no markdown file)`);
      continue;
    }
    const data = {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      group: doc.group,
      order: doc.order,
      content,
      eyebrow: doc.group,
      published: true,
    };

    if (createOnly) {
      const existing = await prisma.document.findUnique({
        where: { slug: doc.slug },
        select: { id: true },
      });
      if (existing) {
        skipped += 1;
        continue;
      }
      await prisma.document.create({ data });
    } else {
      await prisma.document.upsert({
        where: { slug: doc.slug },
        update: {
          title: doc.title,
          description: doc.description,
          group: doc.group,
          order: doc.order,
          content,
          eyebrow: doc.group,
          published: true,
        },
        create: data,
      });
    }
    imported += 1;
  }
  const total = await prisma.document.count();
  console.log(
    `✓ imported ${imported} standalone docs, skipped ${skipped} existing ` +
      `(DB now has ${total} documents)`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
