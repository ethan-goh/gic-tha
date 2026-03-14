import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '../employee.repository';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

export class DeleteEmployeeCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeHandler implements ICommandHandler<DeleteEmployeeCommand> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(command: DeleteEmployeeCommand): Promise<void> {
    const employee = await this.employeeRepository.findById(command.id);
    if (!employee) throw new ResourceNotFoundException('Employee', command.id);
    await this.employeeRepository.delete(command.id);
  }
}
