import { Injectable, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync } from 'node:fs';

@Injectable()
export class ConfigService implements OnModuleInit {
  get cacheDir(): string {
    return process.env.NXMN_CACHE_DIR || './app/cache';
  }

  onModuleInit(): void {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }
}
