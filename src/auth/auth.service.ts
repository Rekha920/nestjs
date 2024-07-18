import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  public getUserToken(user: UserEntity): string {
    this.logger.debug(`request ${user}`)
    return this.jwtService.sign({
      userName: user.userName,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
