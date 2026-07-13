import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

function parse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

@Injectable()
export class SiteContentService {
  constructor(private readonly prisma: PrismaService) {}

  /** All sections as a { key: value } map — one fetch for the whole UI. */
  async getAll(): Promise<Record<string, unknown>> {
    const rows = await this.prisma.siteContent.findMany();
    const out: Record<string, unknown> = {};
    for (const row of rows) out[row.key] = parse(row.value);
    return out;
  }

  async get(key: string) {
    const row = await this.prisma.siteContent.findUnique({ where: { key } });
    if (!row) throw new NotFoundException(`No site content for "${key}"`);
    return parse(row.value);
  }

  async upsert(key: string, value: Record<string, unknown>) {
    const serialized = JSON.stringify(value);
    await this.prisma.siteContent.upsert({
      where: { key },
      create: { key, value: serialized },
      update: { value: serialized },
    });
    return { key, value };
  }
}
