import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CafeRepository } from '../cafe.repository';
import { UpdateCafeDto } from '../dto/update-cafe.dto';
import { Cafe } from '../cafe.entity';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

export class UpdateCafeCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateCafeDto,
  ) {}
}

@CommandHandler(UpdateCafeCommand)
export class UpdateCafeHandler implements ICommandHandler<UpdateCafeCommand> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async execute(command: UpdateCafeCommand): Promise<Cafe> {
    const updated = await this.cafeRepository.update(command.id, command.dto);
    if (!updated) throw new ResourceNotFoundException('Cafe', command.id);
    return updated;
  }
}
