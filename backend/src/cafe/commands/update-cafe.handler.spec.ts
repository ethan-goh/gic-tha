import { Test } from '@nestjs/testing';
import { UpdateCafeHandler, UpdateCafeCommand } from './update-cafe.handler';
import { CafeRepository } from '../cafe.repository';
import { UpdateCafeDto } from '../dto/update-cafe.dto';
import { Cafe } from '../cafe.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

describe('UpdateCafeHandler', () => {
  let handler: UpdateCafeHandler;
  let cafeRepository: jest.Mocked<CafeRepository>;

  const mockCafe: Cafe = {
    id: 'uuid-1',
    name: 'Cafe A',
    description: 'Nice place',
    location: 'Orchard',
    logo: null,
    cafeEmployees: [],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateCafeHandler,
        {
          provide: CafeRepository,
          useValue: { update: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<UpdateCafeHandler>(UpdateCafeHandler);
    cafeRepository = module.get(CafeRepository) as jest.Mocked<CafeRepository>;
  });

  it('should update and return the cafe', async () => {
    const dto: UpdateCafeDto = { name: 'New Name' };
    const updated: Cafe = { ...mockCafe, ...dto };
    cafeRepository.update.mockResolvedValue(updated);

    const result = await handler.execute(new UpdateCafeCommand('uuid-1', dto));

    expect(cafeRepository.update).toHaveBeenCalledWith('uuid-1', dto);
    expect(result).toEqual(updated);
  });

  it('should throw ResourceNotFoundException when cafe does not exist', async () => {
    cafeRepository.update.mockResolvedValue(null);

    await expect(
      handler.execute(new UpdateCafeCommand('bad-id', {})),
    ).rejects.toThrow(ResourceNotFoundException);
  });

  it('should propagate repository errors', async () => {
    cafeRepository.update.mockRejectedValue(new Error('DB failed'));

    await expect(
      handler.execute(new UpdateCafeCommand('uuid-1', {})),
    ).rejects.toThrow('DB failed');
  });
});
