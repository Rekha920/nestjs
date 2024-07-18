import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { Event } from 'src/Events/events.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;
 
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string

  @OneToOne(() => ProfileEntity)
  @JoinColumn()
  profile: ProfileEntity

  @OneToMany(() => Event, (event) => event.organizer)
  organized: Event[];
}