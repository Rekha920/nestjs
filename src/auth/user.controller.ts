import { BadRequestException, Body, Controller, Injectable, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create.user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('user')
export class UserController{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService) {}

  @Post('/createUser')
  public async createUser(@Body() createUserDto: CreateUserDto) {
    const user = new UserEntity();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords Are Identicals']);
    }

    const fetchintgExitingUserWithEmailAndUserName =
      await this.userRepository.findOne({
        where:[{
            userName: createUserDto.userName,
          },
          {
            email: createUserDto.email,
          },
        ],
      });

    if (fetchintgExitingUserWithEmailAndUserName) {
      throw new BadRequestException(['UserName or Email Already Exist']);
    }

    user.userName = createUserDto.userName;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getUserToken(user),
    }
  }
}
