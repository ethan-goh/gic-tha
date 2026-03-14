import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Employee } from './employee.entity';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';
import { EmployeeRepository } from './employee.repository';
import { EmployeeController } from './employee.controller';
import { GetEmployeesHandler } from './queries/get-employees.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, CafeEmployee]),
    CqrsModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeRepository,
    GetEmployeesHandler,
  ],
})
export class EmployeeModule {}
