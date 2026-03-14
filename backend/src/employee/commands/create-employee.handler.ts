import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeRepository } from '../employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from '../employee.entity';
import { CafeEmployee } from '../../cafe-employee/cafe-employee.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

export class CreateEmployeeCommand {
  constructor(public readonly dto: CreateEmployeeDto) {}
}

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand> {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    @InjectRepository(CafeEmployee)
    private readonly cafeEmployeeRepo: Repository<CafeEmployee>,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<Employee> {
    const { cafeId, ...employeeData } = command.dto;

    const employee = await this.employeeRepository.create(employeeData);

    if (cafeId) {
      const assignment = this.cafeEmployeeRepo.create({
        cafeId,
        employeeId: employee.id,
        start_date: new Date(),
      });
      const saved = await this.cafeEmployeeRepo.save(assignment);
      if (!saved) throw new ResourceNotFoundException('Cafe', cafeId);
    }

    return employee;
  }
}
