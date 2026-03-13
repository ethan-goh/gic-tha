import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CafeRepository } from '../cafe.repository';
import { CreateCafeDto } from '../dto/create-cafe.dto';
import { Cafe } from '../cafe.entity';

export class CreateCafeCommand {
  constructor(public readonly dto: CreateCafeDto) {}
}

@CommandHandler(CreateCafeCommand)
export class CreateCafeHandler implements ICommandHandler<CreateCafeCommand> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async execute(command: CreateCafeCommand): Promise<Cafe> {
    return this.cafeRepository.create(command.dto);
  }
}
