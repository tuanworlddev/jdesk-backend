import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateFeedbackDto, UpdateFeedbackDto } from "./dto";
import { FeedbackService } from "./feedback.service";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  // Public: submit feedback. Rate-limited to 5 per minute per IP.
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateFeedbackDto, @Req() req: Request) {
    return this.feedback.create(dto, req.headers["user-agent"]);
  }

  // Admin-only below.
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query("status") status?: string) {
    return this.feedback.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get("stats")
  stats() {
    return this.feedback.stats();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateFeedbackDto) {
    return this.feedback.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.feedback.remove(id);
  }
}
