import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './events.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  // @JoinColumn({
  //   name: 'event_id',
  // })
  @JoinColumn() // any one can be used from the above it will alias the name to event_id
  event: Event;

  @Column('enum',{
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;
}