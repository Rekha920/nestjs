// import { EventService } from './events.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
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
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('/events')
export class EventController {
  private readonly logger = new Logger(EventController.name);

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
    this.logger.log('FIND ALL METHOD CALLED FROM THE EVENT CONTROLLER')
    const events = await this.repository.find({
      // order: {
      //   id: 'DESC',
      // },
      // skip: 1,
      // take: 1,
    });
    this.logger.debug(
      `FIND ALL RESULT : ${events.length}  , ${JSON.stringify(events)}`,
    );
    return events;
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
    const event = await this.repository.findBy({
      id: id,
    });
    if (event.length == 0) {
      this.logger.warn(`inside the exception`);
      throw new NotFoundException();
    }
    return event;
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

    if (!index) {
      this.logger.warn(`inside the exception`);
      throw new NotFoundException();
    }

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

    if (!event) {
      throw new NotFoundException();
    }

    return this.repository.remove(event);
  }
}
