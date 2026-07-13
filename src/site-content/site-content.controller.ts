import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpsertSiteContentDto } from "./dto";
import { SiteContentService } from "./site-content.service";

@Controller("site-content")
export class SiteContentController {
  constructor(private readonly siteContent: SiteContentService) {}

  @Get()
  getAll() {
    return this.siteContent.getAll();
  }

  @Get(":key")
  get(@Param("key") key: string) {
    return this.siteContent.get(key);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":key")
  upsert(@Param("key") key: string, @Body() dto: UpsertSiteContentDto) {
    return this.siteContent.upsert(key, dto.value);
  }
}
