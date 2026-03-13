import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CafeRepository } from '../cafe.repository';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

export class DeleteCafeCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteCafeCommand)
export class DeleteCafeHandler implements ICommandHandler<DeleteCafeCommand> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async execute(command: DeleteCafeCommand): Promise<void> {
    const cafe = await this.cafeRepository.findById(command.id);
    if (!cafe) throw new ResourceNotFoundException('Cafe', command.id);
    await this.cafeRepository.delete(command.id);
  }
}
