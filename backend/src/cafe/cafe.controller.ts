import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCafesQuery } from './queries/get-cafes.handler';
import { CreateCafeCommand } from './commands/create-cafe.handler';
import { UpdateCafeCommand } from './commands/update-cafe.handler';
import { DeleteCafeCommand } from './commands/delete-cafe.handler';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

@Controller('cafes')
export class CafeController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getCafes(@Query('location') location?: string) {
    return this.queryBus.execute(new GetCafesQuery(location));
  }

  @Post()
  createCafe(@Body() dto: CreateCafeDto) {
    return this.commandBus.execute(new CreateCafeCommand(dto));
  }

  @Put(':id')
  updateCafe(@Param('id') id: string, @Body() dto: UpdateCafeDto) {
    return this.commandBus.execute(new UpdateCafeCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  deleteCafe(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteCafeCommand(id));
  }
}
