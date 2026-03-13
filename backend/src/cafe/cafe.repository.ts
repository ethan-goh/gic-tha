import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cafe } from './cafe.entity';

@Injectable()
export class CafeRepository {
  constructor(
    @InjectRepository(Cafe)
    private readonly repo: Repository<Cafe>,
  ) {}

  async findAllWithEmployeeCount(location?: string): Promise<any[]> {
    const query = this.repo
      .createQueryBuilder('cafe')
      .leftJoin('cafe.cafeEmployees', 'ce')
      .addSelect('COUNT(ce.employee_id)', 'employees')
      .groupBy('cafe.id')
      .orderBy('employees', 'DESC');

    if (location) {
      query.where('LOWER(cafe.location) = LOWER(:location)', { location });
    }

    return query.getRawAndEntities().then(({ entities, raw }) =>
      entities.map((cafe, i) => ({
        ...cafe,
        employees: parseInt(raw[i]?.employees ?? '0', 10),
      })),
    );
  }

  async findById(id: string): Promise<Cafe | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Cafe>): Promise<Cafe> {
    const cafe = this.repo.create(data);
    return this.repo.save(cafe);
  }

  async update(id: string, data: Partial<Cafe>): Promise<Cafe | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
