import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto";
import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  // Public reads.
  @Get()
  listPublished() {
    return this.documents.listPublished();
  }

  // Admin: full list including drafts. Declared before :slug to avoid capture.
  @UseGuards(JwtAuthGuard)
  @Get("admin/all")
  listAll() {
    return this.documents.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("admin/:id")
  getById(@Param("id") id: string) {
    return this.documents.getById(id);
  }

  @Get(":slug")
  getPublished(@Param("slug") slug: string) {
    return this.documents.getPublished(slug);
  }

  // Admin writes.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documents.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto) {
    return this.documents.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documents.remove(id);
  }
}
