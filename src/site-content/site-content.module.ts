import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { SiteContentController } from "./site-content.controller";
import { SiteContentService } from "./site-content.service";

@Module({
  imports: [AuthModule],
  controllers: [SiteContentController],
  providers: [SiteContentService],
})
export class SiteContentModule {}
