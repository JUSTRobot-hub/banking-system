import { Get, Post, Body, Put } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigDto } from './dto/config.dto';
import { Config } from './entities/config.entity';
import { BearerAuthPackDecorator } from '../utils/nest.utils';
import { BasicApiDecorators } from '../utils/swagger.utils';
import { Public } from '../auth/decorators/public.decorator';

@BearerAuthPackDecorator({ path: 'Config', version: '1' })
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'Create an app config',
    },
    description: 'create an app config successfully',
    isArray: false,
    dto: Config,
  })
  @Post()
  @Public()
  create(@Body() createConfigDto: ConfigDto) {
    return this.configService.create(createConfigDto);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'Get an app config',
    },
    description: 'get an app config successfully',
    isArray: false,
    dto: Config,
  })
  @Get()
  @Public()
  findOne() {
    return this.configService.findOne();
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'edit an app config',
    },
    description: 'edit an app config successfully',
    isArray: false,
    dto: Config,
  })
  @Put()
  @Public()
  update(@Body() updateConfigDto: ConfigDto) {
    return this.configService.update(updateConfigDto);
  }
}
