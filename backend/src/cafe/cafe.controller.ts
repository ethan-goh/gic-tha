import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCafesQuery } from './queries/get-cafes.handler';

@Controller('cafes')
export class CafeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getCafes(@Query('location') location?: string) {
    return this.queryBus.execute(new GetCafesQuery(location));
  }
}
