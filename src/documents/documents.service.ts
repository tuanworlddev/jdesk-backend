import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto";

const LIST_FIELDS = {
  id: true,
  slug: true,
  title: true,
  description: true,
  eyebrow: true,
  group: true,
  order: true,
  published: true,
  updatedAt: true,
} as const;

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: published docs, ordered — used to build the sidebar. */
  listPublished() {
    return this.prisma.document.findMany({
      where: { published: true },
      select: LIST_FIELDS,
      orderBy: [{ group: "asc" }, { order: "asc" }],
    });
  }

  /** Public: one published doc by slug, full content. */
  async getPublished(slug: string) {
    const doc = await this.prisma.document.findFirst({
      where: { slug, published: true },
    });
    if (!doc) throw new NotFoundException("Document not found");
    return doc;
  }

  /** Admin: every doc including drafts. */
  listAll() {
    return this.prisma.document.findMany({
      select: LIST_FIELDS,
      orderBy: [{ group: "asc" }, { order: "asc" }],
    });
  }

  async getById(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException("Document not found");
    return doc;
  }

  async create(dto: CreateDocumentDto) {
    try {
      return await this.prisma.document.create({
        data: {
          slug: dto.slug,
          title: dto.title,
          description: dto.description,
          eyebrow: dto.eyebrow ?? "Docs",
          group: dto.group ?? "Guides",
          order: dto.order ?? 0,
          content: dto.content ?? "",
          published: dto.published ?? true,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(`A document with slug "${dto.slug}" already exists`);
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateDocumentDto) {
    await this.getById(id);
    try {
      return await this.prisma.document.update({ where: { id }, data: dto });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(`A document with slug "${dto.slug}" already exists`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.document.delete({ where: { id } });
    return { ok: true };
  }
}
