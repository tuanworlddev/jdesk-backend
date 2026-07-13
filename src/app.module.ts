import { Controller, Get, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { DocumentsModule } from "./documents/documents.module";
import { SiteContentModule } from "./site-content/site-content.module";

@Controller()
class HealthController {
  @Get("health")
  health() {
    return { status: "ok", service: "jdesk-backend" };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    FeedbackModule,
    DocumentsModule,
    SiteContentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
