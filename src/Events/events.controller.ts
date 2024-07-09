// import { EventService } from './events.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './events.dto';
import { UpdateEventDto } from './update.events.dto';
import { Event } from './events.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';

@Controller('/events')
export class EventController {
  private events: Event[] = [];

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get('/practice')
  async practice() {
    console.log('inside');
    return await this.repository.find({
      where: [
        {
          id: MoreThan(2),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get()
  async findAll() {
    return await this.repository.find({
      order: {
        id: 'DESC',
      },
      skip: 1,
      take: 1,
    });
  }

  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id) {
  //   console.log(id, typeof id);
  //   return await this.repository.findBy({
  //     id: id,
  //   });
  // }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.repository.findBy({
      id: id,
    });
  }

  @Post()
  async createEvent(
    @Body() input: CreateEventDto,
    // @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
  ) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id,
    @Body() input: UpdateEventDto,
    // @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
  ) {
    const index = await this.repository.findOneBy({
      id: parseInt(id),
    });

    await this.repository.save({
      ...index,
      ...input,
      when: input.when ? new Date(input.when) : index.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async removeEvent(@Param('id') id) {
    const event = await this.repository.findOneBy({
      id: parseInt(id),
    });

    return this.repository.remove(event);
  }
}
