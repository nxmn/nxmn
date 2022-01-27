import { Injectable, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class ConfigService implements OnModuleInit {
  get cacheDir(): string {
    return join(process.cwd(), process.env.NXMN_CACHE_DIR || './cache');
  }

  onModuleInit(): void {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }
}
