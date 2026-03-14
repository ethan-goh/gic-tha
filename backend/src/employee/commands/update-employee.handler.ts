import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '../employee.repository';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../employee.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

export class UpdateEmployeeCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateEmployeeDto,
  ) {}
}

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeHandler implements ICommandHandler<UpdateEmployeeCommand> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(command: UpdateEmployeeCommand): Promise<Employee> {
    const { id, dto } = command;
    const { cafeId, ...employeeData } = dto;

    const updated = await this.employeeRepository.update(id, employeeData);
    if (!updated) throw new ResourceNotFoundException('Employee', id);

    if (cafeId !== undefined) {
      await this.employeeRepository.removeFromCafe(id);
      if (cafeId) {
        await this.employeeRepository.assignToCafe(id, cafeId);
      }
    }

    return updated;
  }
}
