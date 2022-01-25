import { Module } from '@nestjs/common';
import { CacheServerController } from './cache-server.controller';

@Module({
  controllers: [CacheServerController],
  providers: [],
  exports: [],
})
export class CacheServerModule {}
