import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { ensureDirSync } from 'fs-extra';

@Injectable()
export class ConfigService implements OnModuleInit {
  get cacheDir(): string {
    return join(process.cwd(), process.env.NXMN_CACHE_DIR || './cache');
  }

  onModuleInit(): void {
    ensureDirSync(this.cacheDir);
  }
}
