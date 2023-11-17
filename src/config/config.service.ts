import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigDto } from './dto/config.dto';
import { Config } from './entities/config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheManagerService } from '../cache-manager/cache-manager.service';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(Config) private configRepository: Repository<Config>,
    private cacheManagerService: CacheManagerService,
    private logger: Logger,
  ) {}
  async onModuleInit() {
    this.logger.verbose('Config service initialized', 'ConfigService');
    let findConfig = await this.configRepository.findOne({ where: {} });
    if (!findConfig) {
      this.logger.warn('Config not found, creating new one', 'ConfigService');
      findConfig = await this.configRepository.save({
        minDeposit: 50,
        maxDeposit: 4000,
        minWithdraw: 50,
        maxWithdraw: 5000,
      });
    }
    this.logger.verbose('Setting config ...', 'ConfigService');
    await this.cacheManagerService.setConfig(findConfig);
  }

  async create(createConfigDto: ConfigDto) {
    const config = await this.configRepository.findOne({ where: {} });
    if (config) throw new BadRequestException('Config already exists');
    await this.cacheManagerService.setConfig(config);
    return this.configRepository.save(createConfigDto);
  }

  async getConfig() {
    let config = await this.cacheManagerService.getConfig();
    if (!config) {
      config = await this.configRepository.findOne({ where: {} });
      await this.cacheManagerService.setConfig(config);
    }
    return config;
  }

  findOne() {
    return this.configRepository.findOne({ where: {} });
  }

  async update(updateConfigDto: ConfigDto) {
    let config = await this.configRepository.findOne({ where: {} });
    if (!config) throw new NotFoundException('Config not found');

    await this.cacheManagerService.setConfig(updateConfigDto as Config);
    config = {
      ...config,
      ...updateConfigDto,
    };
    return this.configRepository.save(config);
  }
}
