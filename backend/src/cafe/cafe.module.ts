import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Cafe } from './cafe.entity';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';
import { CafeRepository } from './cafe.repository';
import { CafeController } from './cafe.controller';
import { GetCafesHandler } from './queries/get-cafes.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cafe, CafeEmployee]),
    CqrsModule,
  ],
  controllers: [CafeController],
  providers: [CafeRepository, GetCafesHandler],
})
export class CafeModule {}
