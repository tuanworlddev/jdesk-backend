import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFeedbackDto, UpdateFeedbackDto } from "./dto";

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userAgent?: string) {
    // Honeypot tripped — pretend success, store nothing.
    if (dto.website && dto.website.trim().length > 0) {
      return { ok: true };
    }
    await this.prisma.feedback.create({
      data: {
        email: dto.email.trim().toLowerCase(),
        fullName: dto.fullName.trim(),
        content: dto.content.trim(),
        userAgent: userAgent?.slice(0, 300),
      },
    });
    return { ok: true };
  }

  async findAll(status?: string) {
    return this.prisma.feedback.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async stats() {
    const [total, unread] = await Promise.all([
      this.prisma.feedback.count(),
      this.prisma.feedback.count({ where: { status: "new" } }),
    ]);
    return { total, unread };
  }

  async updateStatus(id: string, dto: UpdateFeedbackDto) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Feedback not found");
    return this.prisma.feedback.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Feedback not found");
    await this.prisma.feedback.delete({ where: { id } });
    return { ok: true };
  }
}
