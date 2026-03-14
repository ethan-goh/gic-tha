import { Test } from '@nestjs/testing';
import { DeleteEmployeeHandler, DeleteEmployeeCommand } from './delete-employee.handler';
import { EmployeeRepository } from '../employee.repository';
import { Employee, Gender } from '../employee.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

describe('DeleteEmployeeHandler', () => {
  let handler: DeleteEmployeeHandler;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

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
        DeleteEmployeeHandler,
        {
          provide: EmployeeRepository,
          useValue: { findById: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<DeleteEmployeeHandler>(DeleteEmployeeHandler);
    employeeRepository = module.get(EmployeeRepository) as jest.Mocked<EmployeeRepository>;
  });

  it('should delete the employee when it exists', async () => {
    employeeRepository.findById.mockResolvedValue(mockEmployee);
    employeeRepository.delete.mockResolvedValue(undefined);

    await handler.execute(new DeleteEmployeeCommand('UI1234567'));

    expect(employeeRepository.findById).toHaveBeenCalledWith('UI1234567');
    expect(employeeRepository.delete).toHaveBeenCalledWith('UI1234567');
  });

  it('should throw ResourceNotFoundException when employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteEmployeeCommand('bad-id')),
    ).rejects.toThrow(ResourceNotFoundException);

    expect(employeeRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    employeeRepository.findById.mockRejectedValue(new Error('DB failed'));

    await expect(
      handler.execute(new DeleteEmployeeCommand('UI1234567')),
    ).rejects.toThrow('DB failed');
  });
});
