import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Cafe } from './cafe.entity';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';
import { CafeRepository } from './cafe.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cafe, CafeEmployee]),
    CqrsModule,
  ],
  providers: [CafeRepository],
})
export class CafeModule {}
