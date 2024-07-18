import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super();
    this.logger.debug('INSIDE LOCAL STRATEGY CONSTRUCTOR')
  }

  public async validate(userName: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userName: userName },
    });

    if (!user) {
      this.logger.debug(`User ${userName} not found!`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${userName}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
