import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvent, WhenEventFilter } from './input/list.events';
import { Event } from './events.entity';
import { Subject } from 'src/school/subject.entity';
import { CreateEventDto } from './input/events.dto';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class EventService {
  
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsServiceRepository: Repository<Event>
  ) {}

  private getEventBasedQuery() {
    return this.eventsServiceRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getAttendeeCount() {
    return await this.getEventBasedQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
       .loadRelationCountAndMap(
        'e.attendeeMayBe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  public async getAttendeeCountWithFilter(filter?: ListEvent) {
    let query = await this.getAttendeeCount();

    if (!filter) {
      return (await query).getMany();
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.TODAY) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
        );
      }

      if (filter.when == WhenEventFilter.TOMORROW) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
        );
      }

      if (filter.when == WhenEventFilter.THISWEEK) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (filter.when == WhenEventFilter.NEXTWEEK) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      }
    }

    return (await query).getMany();
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = (await this.getAttendeeCount()).andWhere('e.id = :id', {
      id,
    });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsServiceRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async createEvent(
    input: CreateEventDto,
    user: UserEntity,
  ): Promise<Event> {
    return await this.eventsServiceRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

}
