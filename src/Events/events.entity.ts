import {
  Column,
  Entity,
  JoinColumn,

  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { UserEntity } from 'src/auth/user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
 
  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event,
{
    eager: true
})
  attendees: Attendee[];

  @ManyToOne(() => UserEntity, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  organizer: UserEntity;

  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;

  attendeeAccepted?: number;

  attendeeFailed?: number;

  attendeeRejected?: number;
};

//event will have many attendeess