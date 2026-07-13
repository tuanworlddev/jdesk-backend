import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AdminPayload } from "./auth.service";

/** Requires a valid admin Bearer token. Attaches the payload to req.user. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization ?? "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Missing bearer token");
    }
    try {
      const payload = await this.jwt.verifyAsync<AdminPayload>(token);
      (req as Request & { user?: AdminPayload }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
