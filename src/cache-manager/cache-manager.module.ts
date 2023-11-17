import { Logger, Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { CacheManagerController } from './cache-manager.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [CacheManagerController],
  providers: [CacheManagerService, Logger],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
