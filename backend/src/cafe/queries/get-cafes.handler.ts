import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CafeRepository } from '../cafe.repository';

export class GetCafesQuery {
  constructor(public readonly location?: string) {}
}

@QueryHandler(GetCafesQuery)
export class GetCafesHandler implements IQueryHandler<GetCafesQuery> {
  constructor(private readonly cafeRepository: CafeRepository) {}

  async execute(query: GetCafesQuery) {
    return this.cafeRepository.findAllWithEmployeeCount(query.location);
  }
}
