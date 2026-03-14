import { Test } from '@nestjs/testing';
import { GetEmployeesHandler, GetEmployeesQuery } from './get-employees.handler';
import { EmployeeRepository } from '../employee.repository';

describe('GetEmployeesHandler', () => {
  let handler: GetEmployeesHandler;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

  const mockEmployees = [
    { id: 'UI1234567', name: 'Alice Tan', email_address: 'alice@email.com', phone_number: '91234567', days_worked: 500, cafe: 'Brewlicious' },
    { id: 'UI2345678', name: 'Bob Lim', email_address: 'bob@email.com', phone_number: '82345678', days_worked: 200, cafe: 'Beanstalk' },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetEmployeesHandler,
        {
          provide: EmployeeRepository,
          useValue: { findAllWithCafeAndDaysWorked: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetEmployeesHandler>(GetEmployeesHandler);
    employeeRepository = module.get(EmployeeRepository) as jest.Mocked<EmployeeRepository>;
  });

  it('should return all employees when no cafeId is provided', async () => {
    employeeRepository.findAllWithCafeAndDaysWorked.mockResolvedValue(mockEmployees);

    const result = await handler.execute(new GetEmployeesQuery());

    expect(employeeRepository.findAllWithCafeAndDaysWorked).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockEmployees);
  });

  it('should pass cafeId to repository when provided', async () => {
    const filtered = [mockEmployees[0]];
    employeeRepository.findAllWithCafeAndDaysWorked.mockResolvedValue(filtered);

    const result = await handler.execute(new GetEmployeesQuery('cafe-uuid-1'));

    expect(employeeRepository.findAllWithCafeAndDaysWorked).toHaveBeenCalledWith('cafe-uuid-1');
    expect(result).toEqual(filtered);
  });

  it('should return empty array when no employees match', async () => {
    employeeRepository.findAllWithCafeAndDaysWorked.mockResolvedValue([]);

    const result = await handler.execute(new GetEmployeesQuery('nonexistent-cafe'));

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    employeeRepository.findAllWithCafeAndDaysWorked.mockRejectedValue(new Error('DB failed'));

    await expect(handler.execute(new GetEmployeesQuery())).rejects.toThrow('DB failed');
  });
});
