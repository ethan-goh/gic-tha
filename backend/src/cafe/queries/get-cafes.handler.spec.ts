import { Test } from '@nestjs/testing';
import { GetCafesHandler, GetCafesQuery } from './get-cafes.handler';
import { CafeRepository } from '../cafe.repository';

describe('GetCafesHandler', () => {
  let handler: GetCafesHandler;
  let cafeRepository: jest.Mocked<CafeRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetCafesHandler,
        {
          provide: CafeRepository,
          useValue: { findAllWithEmployeeCount: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetCafesHandler>(GetCafesHandler);
    cafeRepository = module.get(CafeRepository) as jest.Mocked<CafeRepository>;
  });

  it('should return all cafes when no location is provided', async () => {
    const mockCafes = [
      { id: '1', name: 'Cafe A', employees: 3 },
      { id: '2', name: 'Cafe B', employees: 1 },
    ];
    cafeRepository.findAllWithEmployeeCount.mockResolvedValue(mockCafes);

    const result = await handler.execute(new GetCafesQuery());

    expect(cafeRepository.findAllWithEmployeeCount).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockCafes);
  });

  it('should pass location to repository when location is provided', async () => {
    const mockCafes = [{ id: '1', name: 'Cafe A', location: 'Orchard Road', employees: 2 }];
    cafeRepository.findAllWithEmployeeCount.mockResolvedValue(mockCafes);

    const result = await handler.execute(new GetCafesQuery('Orchard Road'));

    expect(cafeRepository.findAllWithEmployeeCount).toHaveBeenCalledWith('Orchard Road');
    expect(result).toEqual(mockCafes);
  });

  it('should return empty array when no cafes match the location', async () => {
    cafeRepository.findAllWithEmployeeCount.mockResolvedValue([]);

    const result = await handler.execute(new GetCafesQuery('Nonexistent Place'));

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    cafeRepository.findAllWithEmployeeCount.mockRejectedValue(new Error('DB failed'));

    await expect(handler.execute(new GetCafesQuery())).rejects.toThrow('DB failed');
  });
});
