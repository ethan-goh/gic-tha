import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEmployeesQuery } from './queries/get-employees.handler';
import { CreateEmployeeCommand } from './commands/create-employee.handler';
import { UpdateEmployeeCommand } from './commands/update-employee.handler';
import { DeleteEmployeeCommand } from './commands/delete-employee.handler';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getEmployees(@Query('cafe') cafeId?: string) {
    return this.queryBus.execute(new GetEmployeesQuery(cafeId));
  }

  @Post()
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.commandBus.execute(new CreateEmployeeCommand(dto));
  }

  @Put(':id')
  updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.commandBus.execute(new UpdateEmployeeCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  deleteEmployee(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteEmployeeCommand(id));
  }
}
