import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Employee } from './employee.entity';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';
import { EmployeeRepository } from './employee.repository';
import { EmployeeController } from './employee.controller';
import { GetEmployeesHandler } from './queries/get-employees.handler';
import { CreateEmployeeHandler } from './commands/create-employee.handler';
import { UpdateEmployeeHandler } from './commands/update-employee.handler';
import { DeleteEmployeeHandler } from './commands/delete-employee.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, CafeEmployee]),
    CqrsModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeRepository,
    GetEmployeesHandler,
    CreateEmployeeHandler,
    UpdateEmployeeHandler,
    DeleteEmployeeHandler,
  ],
})
export class EmployeeModule {}
