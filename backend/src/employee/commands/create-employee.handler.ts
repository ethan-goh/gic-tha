import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '../employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from '../employee.entity';

export class CreateEmployeeCommand {
  constructor(public readonly dto: CreateEmployeeDto) {}
}

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(command: CreateEmployeeCommand): Promise<Employee> {
    const { cafeId, ...employeeData } = command.dto;

    const employee = await this.employeeRepository.create(employeeData);

    if (cafeId) {
      await this.employeeRepository.assignToCafe(employee.id, cafeId);
    }

    return employee;
  }
}
