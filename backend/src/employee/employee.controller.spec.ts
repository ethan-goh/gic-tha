import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmployeeController } from './employee.controller';
import { GetEmployeesQuery } from './queries/get-employees.handler';
import { CreateEmployeeCommand } from './commands/create-employee.handler';
import { UpdateEmployeeCommand } from './commands/update-employee.handler';
import { DeleteEmployeeCommand } from './commands/delete-employee.handler';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Gender } from './employee.entity';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let queryBus: jest.Mocked<QueryBus>;
  let commandBus: jest.Mocked<CommandBus>;

  const createDto: CreateEmployeeDto = {
    name: 'Alice Tan',
    email_address: 'alice@email.com',
    phone_number: '91234567',
    gender: Gender.FEMALE,
  };

  const updateDto: UpdateEmployeeDto = { name: 'Bob Tan' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        { provide: QueryBus, useValue: { execute: jest.fn() } },
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    queryBus = module.get(QueryBus) as jest.Mocked<QueryBus>;
    commandBus = module.get(CommandBus) as jest.Mocked<CommandBus>;
  });

  it('should dispatch GetEmployeesQuery with no cafeId', () => {
    controller.getEmployees(undefined);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetEmployeesQuery(undefined));
  });

  it('should dispatch GetEmployeesQuery with cafeId', () => {
    controller.getEmployees('cafe-uuid-1');
    expect(queryBus.execute).toHaveBeenCalledWith(new GetEmployeesQuery('cafe-uuid-1'));
  });

  it('should dispatch CreateEmployeeCommand', () => {
    controller.createEmployee(createDto);
    expect(commandBus.execute).toHaveBeenCalledWith(new CreateEmployeeCommand(createDto));
  });

  it('should dispatch UpdateEmployeeCommand', () => {
    controller.updateEmployee('UI1234567', updateDto);
    expect(commandBus.execute).toHaveBeenCalledWith(new UpdateEmployeeCommand('UI1234567', updateDto));
  });

  it('should dispatch DeleteEmployeeCommand', () => {
    controller.deleteEmployee('UI1234567');
    expect(commandBus.execute).toHaveBeenCalledWith(new DeleteEmployeeCommand('UI1234567'));
  });
});
