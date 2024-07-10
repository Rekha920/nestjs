import { Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  getHello(): string {
    console.log(process.env.DB_HOST);
    return 'こんにちは世界';
  }
}