import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CafeController } from './cafe.controller';
import { GetCafesQuery } from './queries/get-cafes.handler';
import { CreateCafeCommand } from './commands/create-cafe.handler';
import { UpdateCafeCommand } from './commands/update-cafe.handler';
import { DeleteCafeCommand } from './commands/delete-cafe.handler';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

describe('CafeController', () => {
  let controller: CafeController;
  let queryBus: jest.Mocked<QueryBus>;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CafeController],
      providers: [
        { provide: QueryBus, useValue: { execute: jest.fn() } },
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CafeController>(CafeController);
    queryBus = module.get(QueryBus) as jest.Mocked<QueryBus>;
    commandBus = module.get(CommandBus) as jest.Mocked<CommandBus>;
  });

  it('should dispatch GetCafesQuery with no location', () => {
    controller.getCafes(undefined);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetCafesQuery(undefined));
  });

  it('should dispatch GetCafesQuery with location', () => {
    controller.getCafes('Orchard');
    expect(queryBus.execute).toHaveBeenCalledWith(new GetCafesQuery('Orchard'));
  });

  it('should dispatch CreateCafeCommand', () => {
    const dto: CreateCafeDto = { name: 'Cafe A', description: 'Nice place', location: 'Orchard' };
    controller.createCafe(dto);
    expect(commandBus.execute).toHaveBeenCalledWith(new CreateCafeCommand(dto));
  });

  it('should dispatch UpdateCafeCommand', () => {
    const dto: UpdateCafeDto = { name: 'New Name' };
    controller.updateCafe('uuid-1', dto);
    expect(commandBus.execute).toHaveBeenCalledWith(new UpdateCafeCommand('uuid-1', dto));
  });

  it('should dispatch DeleteCafeCommand', () => {
    controller.deleteCafe('uuid-1');
    expect(commandBus.execute).toHaveBeenCalledWith(new DeleteCafeCommand('uuid-1'));
  });
});
