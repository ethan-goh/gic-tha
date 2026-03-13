import { Test } from '@nestjs/testing';
import { CreateCafeHandler, CreateCafeCommand } from './create-cafe.handler';
import { CafeRepository } from '../cafe.repository';
import { CreateCafeDto } from '../dto/create-cafe.dto';
import { Cafe } from '../cafe.entity';

describe('CreateCafeHandler', () => {
  let handler: CreateCafeHandler;
  let cafeRepository: jest.Mocked<CafeRepository>;

  const dto: CreateCafeDto = {
    name: 'Cafe A',
    description: 'Nice place',
    location: 'Orchard',
  };

  const mockCafe: Cafe = {
    id: 'uuid-1',
    ...dto,
    logo: null,
    cafeEmployees: [],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateCafeHandler,
        {
          provide: CafeRepository,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<CreateCafeHandler>(CreateCafeHandler);
    cafeRepository = module.get(CafeRepository) as jest.Mocked<CafeRepository>;
  });

  it('should create and return a new cafe', async () => {
    cafeRepository.create.mockResolvedValue(mockCafe);

    const result = await handler.execute(new CreateCafeCommand(dto));

    expect(cafeRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCafe);
  });

  it('should propagate repository errors', async () => {
    cafeRepository.create.mockRejectedValue(new Error('DB failed'));

    await expect(handler.execute(new CreateCafeCommand(dto))).rejects.toThrow('DB failed');
  });
});
