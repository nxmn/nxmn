import { Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.cacheDir,
        storage: multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, configService.cacheDir);
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [CacheController],
})
export class AppModule {}
