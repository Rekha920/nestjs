import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './events.dto';

export class UpdateEventDto extends PartialType(CreateEventDto){
}