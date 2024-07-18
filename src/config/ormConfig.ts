import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from '../Events/events.entity';
import { Attendee } from '../Events/attendee.entity';
import { Teacher } from '../school/teacher.entity';
import { Subject } from '../school/subject.entity';
import { UserEntity } from 'src/auth/user.entity';
import { ProfileEntity } from '../auth/profile.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Subject, Teacher, UserEntity, ProfileEntity],
    synchronize: true,
  }),
);
