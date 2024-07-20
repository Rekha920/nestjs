import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'src/pagination/paginator';
import * as paginator from '../pagination/paginator';
import { first } from 'rxjs';

jest.mock('../pagination/paginator');

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;
  let selectOb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectOb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      save: jest.fn(),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectOb),
            where: jest.fn(),
            excute: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('Update Event', () => {
    it('It should update the Event', async () => {
      const repoSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({ id: 1 } as Event);
      expect(
        service.updateEvent(new Event({ id: 1 }), {
          name: 'new Event',
        }),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'new Event' });
    });
  });

  describe('Delete Event', () => {
    it('It Should delete the event', async () => {
      const createBuilderSpy = jest.spyOn(
        eventRepository,
        'createQueryBuilder',
      );
      const deleteSpy = jest
        .spyOn(selectOb, 'delete')
        .mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      expect(service.deleteEvent(1)).resolves.toBeUndefined();
      expect(createBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createBuilderSpy).toHaveBeenCalledWith('e');
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe(' getEventsAttendedByUserIdPaginated ', () => {
    it('it should return the paginated result', async () => {
      const orderBySpy = jest
        .spyOn(selectOb, 'orderBy')
        .mockReturnValue(selectOb);

      const leftJoinSpy = jest
        .spyOn(selectOb, 'leftJoinAndSelect')
        .mockReturnValue(selectOb);

      const whereSpy = jest.spyOn(selectOb, 'where').mockReturnValue(selectOb);

      mockedPaginate.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });

      expect(
        service.getEventsAttendedByUserIdPaginated(400, {
          limit: 1,
          currentPage: 1
        })
      ).resolves.toEqual({
        first: 1,
        last: 1,
        data: [],
        total: 10,
        limit: 10
      })

      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');
      expect(leftJoinSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinSpy).toHaveBeenCalledWith('e.attendees', 'a');
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId: 400,
      });
      expect(mockedPaginate).toHaveBeenCalledTimes(1);
      expect(mockedPaginate).toHaveBeenCalledWith(selectOb, {
        currentPage: 1,
        limit:1
      })
    });
  });

  
});
