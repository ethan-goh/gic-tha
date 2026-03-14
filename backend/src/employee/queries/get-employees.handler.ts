import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '../employee.repository';

export class GetEmployeesQuery {
  constructor(public readonly cafeId?: string) {}
}

@QueryHandler(GetEmployeesQuery)
export class GetEmployeesHandler implements IQueryHandler<GetEmployeesQuery> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: GetEmployeesQuery) {
    return this.employeeRepository.findAllWithCafeAndDaysWorked(query.cafeId);
  }
}
