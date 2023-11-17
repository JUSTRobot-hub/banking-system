import { Logger, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { Config } from './entities/config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Config]), CacheManagerModule],
  controllers: [ConfigController],
  providers: [ConfigService, Logger],
  exports: [ConfigService],
})
export class ConfigModule {}
