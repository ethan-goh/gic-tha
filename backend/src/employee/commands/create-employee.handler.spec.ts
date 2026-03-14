import { Test } from '@nestjs/testing';
import { CreateEmployeeHandler, CreateEmployeeCommand } from './create-employee.handler';
import { EmployeeRepository } from '../employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee, Gender } from '../employee.entity';

describe('CreateEmployeeHandler', () => {
  let handler: CreateEmployeeHandler;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

  const dto: CreateEmployeeDto = {
    name: 'Alice Tan',
    email_address: 'alice@email.com',
    phone_number: '91234567',
    gender: Gender.FEMALE,
  };

  const mockEmployee: Employee = {
    id: 'UI1234567',
    name: 'Alice Tan',
    email_address: 'alice@email.com',
    phone_number: '91234567',
    gender: Gender.FEMALE,
    cafeEmployee: null,
    generateId: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: { create: jest.fn(), assignToCafe: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<CreateEmployeeHandler>(CreateEmployeeHandler);
    employeeRepository = module.get(EmployeeRepository) as jest.Mocked<EmployeeRepository>;
  });

  it('should create an employee without cafe assignment', async () => {
    employeeRepository.create.mockResolvedValue(mockEmployee);

    const result = await handler.execute(new CreateEmployeeCommand(dto));

    expect(employeeRepository.create).toHaveBeenCalledWith({ name: dto.name, email_address: dto.email_address, phone_number: dto.phone_number, gender: dto.gender });
    expect(employeeRepository.assignToCafe).not.toHaveBeenCalled();
    expect(result).toEqual(mockEmployee);
  });

  it('should create an employee and assign to cafe', async () => {
    const dtoWithCafe: CreateEmployeeDto = { ...dto, cafeId: 'cafe-uuid-1' };
    employeeRepository.create.mockResolvedValue(mockEmployee);
    employeeRepository.assignToCafe.mockResolvedValue(undefined);

    const result = await handler.execute(new CreateEmployeeCommand(dtoWithCafe));

    expect(employeeRepository.assignToCafe).toHaveBeenCalledWith(mockEmployee.id, 'cafe-uuid-1');
    expect(result).toEqual(mockEmployee);
  });

  it('should propagate repository errors', async () => {
    employeeRepository.create.mockRejectedValue(new Error('DB failed'));

    await expect(handler.execute(new CreateEmployeeCommand(dto))).rejects.toThrow('DB failed');
  });
});
