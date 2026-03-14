import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CafeEmployee } from '../cafe-employee/cafe-employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
    @InjectRepository(CafeEmployee)
    private readonly cafeEmployeeRepo: Repository<CafeEmployee>,
  ) {}

  async findAllWithCafeAndDaysWorked(cafeId?: string): Promise<any[]> {
    const query = this.repo
      .createQueryBuilder('employee')
      .leftJoin('employee.cafeEmployee', 'ce')
      .leftJoin('ce.cafe', 'cafe')
      .addSelect('ce.start_date', 'start_date')
      .addSelect('cafe.name', 'cafe_name')
      .addSelect(
        `COALESCE(CURRENT_DATE - ce.start_date::date, 0)`,
        'days_worked',
      );

    if (cafeId) {
      query.where('cafe.id = :cafeId', { cafeId });
    }

    query.orderBy('days_worked', 'DESC');

    return query.getRawAndEntities().then(({ entities, raw }) =>
      entities.map((employee, i) => ({
        id: employee.id,
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        gender: employee.gender,
        days_worked: parseInt(raw[i]?.days_worked ?? '0', 10),
        cafe: raw[i]?.cafe_name ?? '',
      })),
    );
  }

  async findById(id: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const employee = this.repo.create(data);
    return this.repo.save(employee);
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async assignToCafe(employeeId: string, cafeId: string): Promise<void> {
    const assignment = this.cafeEmployeeRepo.create({
      cafeId,
      employeeId,
      start_date: new Date(),
    });
    await this.cafeEmployeeRepo.save(assignment);
  }

  async removeFromCafe(employeeId: string): Promise<void> {
    await this.cafeEmployeeRepo.delete({ employeeId });
  }
}
