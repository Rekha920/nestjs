import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events.entity';
import { EventController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
})
export class EventsModule {}