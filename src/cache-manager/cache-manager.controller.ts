import { Controller } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';

@Controller('cache-manager')
export class CacheManagerController {
  constructor(private readonly cacheManagerService: CacheManagerService) {}
}
