import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './Events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './Events/events.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Rekha@12345',
      database: 'nest-events',
      entities: [Event],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [AppController, EventController],
  providers: [AppService],
})
export class AppModule {}
