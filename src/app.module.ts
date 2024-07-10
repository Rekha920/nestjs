import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './Events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './Events/events.entity';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/ormConfig';
import ormConfigProd from './config/ormConfig.prod';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([Event]),
    EventsModule,
  ],
  controllers: [AppController, EventController],
  //providers: [AppService],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService,
    },
  ], // custome provider
})
export class AppModule {}
