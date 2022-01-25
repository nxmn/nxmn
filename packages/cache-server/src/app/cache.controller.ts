import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  Head,
  Res,
  HttpStatus,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from './config/config.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cache'))
  upload() {
    // empty
  }

  @Head(':cache')
  findOne(@Res() res: Response, @Param('cache') cache: string) {
    if (this.doesCacheExist(cache)) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Get(':cache')
  download(@Param('cache') cache: string): StreamableFile {
    if (!this.doesCacheExist(cache)) {
      throw new NotFoundException('Cache not found');
    }
    return new StreamableFile(createReadStream(this.getCachePath(cache)));
  }

  private doesCacheExist(cache: string): boolean {
    return existsSync(join(this.configService.cacheDir, cache));
  }

  private getCachePath(cache: string): string {
    return join(this.configService.cacheDir, cache);
  }
}
