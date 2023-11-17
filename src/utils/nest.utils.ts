import { applyDecorators, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function BearerAuthPackDecorator(controllerOptions: {
  path: string;
  version?: string;
}) {
  return applyDecorators(
    Controller({
      path: controllerOptions.path.toLowerCase(),
      version: controllerOptions.version || null,
    }),
    ApiBearerAuth(),
    ApiTags(controllerOptions.path),
  );
}
