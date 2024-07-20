import { Repository } from 'typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { ListEvents } from './input/list.events';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Profile } from '../auth/profile.entity';
import exp from 'constants';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let eventRepository: Repository<Event>;
//   beforeAll(() => {
//     console.log('It should be called Once..!');
//   });

  beforeEach(() => {
    eventsService = new EventsService(eventRepository);
    eventsController = new EventsController(eventsService);
    console.log('pop uped each time')
  })


  it('It should return the list of all Events', async () => {
    const result={
      first: 1,
      limit: 10,
      data:[],
      total:0
    }

    
    // eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    let spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventsController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(' it should remove the event', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');

    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => undefined);

    try {
      await eventsController.remove(1, new User()) 
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
    
    expect(deleteSpy).toHaveBeenCalledTimes(0);
    expect(findSpy).toHaveBeenCalledTimes(1)
  })
 
  it(' It should return the one event', async () => {
    const result={
      id: 1,
      name: 'Interesting Party',
      description: 'That is a crazy event, must go there!',
      when: '2021-04-15T15:30:00.000Z',
      address: 'Local St 101'
    };

    let spy = jest
      .spyOn(eventsService, 'getEventWithAttendeeCount')
      .mockImplementation((): any => result);
    
    expect(await eventsController.findOne(1)).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('If Single Event is not Found', async () =>{
    let spy = jest
      .spyOn(eventsService, 'getEventWithAttendeeCount')
      .mockImplementation((): any => undefined);
  
    try {
      expect(await eventsController.findOne(100)).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('It should  remove if the user is authorize the organizer ', async ()=>{
    const result ={
      id: 1,
      name: 'Interesting Party',
      description: 'That is a crazy event, must go there!',
      when: '2021-04-15T15:30:00.000Z',
      address: 'Local St 101',
      organizer: {
        id: 1,
        username: 'Rekha Dodani',
        email: 'rekha@gmail.com',
        firstName: 'Rekha',
        lastName: 'Dodani',
      }
  }
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');

    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => result);
     try{
      await eventsController.remove(1, { id: 1 } as User);
     }catch(error){
        console.log("hvhghj")
     }
    
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  })

  it('It should throw ForbiddenException if user is not the organizer ', async ()=>{
    const result ={
      id: 1,
      name: 'Interesting Party',
      description: 'That is a crazy event, must go there!',
      when: '2021-04-15T15:30:00.000Z',
      address: 'Local St 101',
      organizer: {
        id: 1,
        username: 'Rekha Dodani',
        email: 'rekha@gmail.com',
        firstName: 'Rekha',
        lastName: 'Dodani',
      }
  }
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');

    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => result);
    await expect(
      eventsController.remove(result.id, { id: 2 } as User),
    ).rejects.toThrow(
      new ForbiddenException(
        null,
        'You are not authorized to remove this event',
      ))
    expect(deleteSpy).toHaveBeenCalledTimes(0);
    expect(findSpy).toHaveBeenCalledTimes(1)
  })
});
