import { Test } from '@nestjs/testing';
import { UpdateEmployeeHandler, UpdateEmployeeCommand } from './update-employee.handler';
import { EmployeeRepository } from '../employee.repository';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee, Gender } from '../employee.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

describe('UpdateEmployeeHandler', () => {
  let handler: UpdateEmployeeHandler;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

  const dto: UpdateEmployeeDto = { name: 'Bob Tan' };

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
        UpdateEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: {
            update: jest.fn(),
            assignToCafe: jest.fn(),
            removeFromCafe: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateEmployeeHandler>(UpdateEmployeeHandler);
    employeeRepository = module.get(EmployeeRepository) as jest.Mocked<EmployeeRepository>;
  });

  it('should update and return the employee', async () => {
    const updated: Employee = { ...mockEmployee, ...dto };
    employeeRepository.update.mockResolvedValue(updated);

    const result = await handler.execute(new UpdateEmployeeCommand('UI1234567', dto));

    expect(employeeRepository.update).toHaveBeenCalledWith('UI1234567', dto);
    expect(employeeRepository.removeFromCafe).not.toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('should reassign employee to a new cafe', async () => {
    const dtoWithCafe: UpdateEmployeeDto = { ...dto, cafeId: 'cafe-uuid-2' };
    employeeRepository.update.mockResolvedValue(mockEmployee);
    employeeRepository.removeFromCafe.mockResolvedValue(undefined);
    employeeRepository.assignToCafe.mockResolvedValue(undefined);

    await handler.execute(new UpdateEmployeeCommand('UI1234567', dtoWithCafe));

    expect(employeeRepository.removeFromCafe).toHaveBeenCalledWith('UI1234567');
    expect(employeeRepository.assignToCafe).toHaveBeenCalledWith('UI1234567', 'cafe-uuid-2');
  });

  it('should remove cafe assignment when cafeId is empty string', async () => {
    const dtoUnassign: UpdateEmployeeDto = { cafeId: '' };
    employeeRepository.update.mockResolvedValue(mockEmployee);
    employeeRepository.removeFromCafe.mockResolvedValue(undefined);

    await handler.execute(new UpdateEmployeeCommand('UI1234567', dtoUnassign));

    expect(employeeRepository.removeFromCafe).toHaveBeenCalledWith('UI1234567');
    expect(employeeRepository.assignToCafe).not.toHaveBeenCalled();
  });

  it('should throw ResourceNotFoundException when employee does not exist', async () => {
    employeeRepository.update.mockResolvedValue(null);

    await expect(
      handler.execute(new UpdateEmployeeCommand('bad-id', dto)),
    ).rejects.toThrow(ResourceNotFoundException);
  });

  it('should propagate repository errors', async () => {
    employeeRepository.update.mockRejectedValue(new Error('DB failed'));

    await expect(
      handler.execute(new UpdateEmployeeCommand('UI1234567', dto)),
    ).rejects.toThrow('DB failed');
  });
});
