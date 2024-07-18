import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @Length(5)  
  userName: string;

  @IsEmail()
  email: string;

  @Length(9)
  password: string;

  @Length(9)
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;
}
