import {
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './currentUser.decorator';
import { UserEntity } from './user.entity';
import { AuthGuardLocal } from './auth-gurad-local';
import { AuthGuardJwt } from './auth-guard.jwt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: UserEntity){
    //this.logger.debug(`request $request)}`);
    return {
      userId: user.id,
      token: this.authService.getUserToken(user)
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: UserEntity){
    return user;
  }

}