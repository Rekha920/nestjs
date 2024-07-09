import { IsDateString, Length } from 'class-validator';

export class CreateEventDto{
    @Length(5,255 ,{message : 'The Name length is wrong.!'})
    name: string;
    @Length(5,255)
    description :  string;

    @IsDateString()
    when: string;

    // @Length(5,25,{groups:['create']}) // for local validation create ke tym pe limit of string 5 to 25 hai
    // @Length(10,25,{groups:['update']}) // for local validation create ke tym pe limit of string 10 to 25 hai
    @Length(5, 255)
    address: string;
}