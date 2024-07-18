// import { EventService } from './events.service';
import {
  Body,
  ClassSerializerInterceptor,
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
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/events.dto';
import { UpdateEventDto } from './input/update.events.dto';
import { Event } from './events.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { EventService } from './events.service';
import { ListEvent } from './input/list.events';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    private readonly eventsService: EventService,
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

  @Get('/practice2')
  async practice2() {
    return await this.repository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('id', 'DESC')
      .take(3)
      .getMany();
    //agr entity mai eager nh use krna hai toh find(1,{ relations:['attendees]})
    // return await this.repository.findAndCount(); //ye eager true hai toh
    // return await this.repository.findOne({
    //   relations: ['attendees']
    // })
  }

  // @Get()
  // async findAll() {
  //   this.logger.log('FIND ALL METHOD CALLED FROM THE EVENT CONTROLLER')
  //   const events = await this.repository.find({
  //     // order: {
  //     //   id: 'DESC',
  //     // },
  //     // skip: 1,
  //     // take: 1,
  //   });
  //   this.logger.debug(
  //     `FIND ALL RESULT : ${events.length}  , ${JSON.stringify(events)}`,
  //   );
  //   return events;
  // }

  
  @Get()
  async findAll(@Query() filter: ListEvent) {
    this.logger.debug(filter, 'filter');
    this.logger.log('FIND ALL METHOD CALLED FROM THE EVENT CONTROLLER')
    const events = await this.eventsService.getAttendeeCountWithFilter(filter);
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
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {

    return await this.eventsService.getEvent(id);
    // const event = await this.repository.findBy({
    //   id: id,
    // });
    // if (event.length == 0) {
    //   this.logger.warn(`inside the exception`);
    //   throw new NotFoundException();
    // }
    // return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async createEvent(
    @Body() input: CreateEventDto,
    @CurrentUser() user: UserEntity,
    // @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
  ) {
    return this.eventsService.createEvent(input, user);
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
    const result = await this.eventsService.deleteEvent(id);

    if (result?.affected !== 1) {
      throw new NotFoundException();
    }

   return result;
  }
}
