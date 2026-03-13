import { Test } from '@nestjs/testing';
import { DeleteCafeHandler, DeleteCafeCommand } from './delete-cafe.handler';
import { CafeRepository } from '../cafe.repository';
import { Cafe } from '../cafe.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

describe('DeleteCafeHandler', () => {
  let handler: DeleteCafeHandler;
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
        DeleteCafeHandler,
        {
          provide: CafeRepository,
          useValue: { findById: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<DeleteCafeHandler>(DeleteCafeHandler);
    cafeRepository = module.get(CafeRepository) as jest.Mocked<CafeRepository>;
  });

  it('should delete the cafe when it exists', async () => {
    cafeRepository.findById.mockResolvedValue(mockCafe);
    cafeRepository.delete.mockResolvedValue(undefined);

    await handler.execute(new DeleteCafeCommand('uuid-1'));

    expect(cafeRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(cafeRepository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw ResourceNotFoundException when cafe does not exist', async () => {
    cafeRepository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteCafeCommand('bad-id')),
    ).rejects.toThrow(ResourceNotFoundException);

    expect(cafeRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    cafeRepository.findById.mockRejectedValue(new Error('DB failed'));

    await expect(
      handler.execute(new DeleteCafeCommand('uuid-1')),
    ).rejects.toThrow('DB failed');
  });
});
