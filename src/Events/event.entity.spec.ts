import { Event } from './event.entity';

test(' Event should be initialized to the constructor', () => {
  const event = new Event({
    name: 'dance on thr show',
    description: ' the show must go on',
})

  expect(event).toEqual({
    name: 'dance on thr show',
    description: ' the show must go on',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  })
});
