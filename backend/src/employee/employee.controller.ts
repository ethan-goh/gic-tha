import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetEmployeesQuery } from './queries/get-employees.handler';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getEmployees(@Query('cafe') cafeId?: string) {
    return this.queryBus.execute(new GetEmployeesQuery(cafeId));
  }
}
