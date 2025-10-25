import { Injectable } from '@nestjs/common';
import { UsersQueriesRepository } from '../repositories/users-queries.repository';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

type Options = {
  withPassword?: boolean;
  ensureActive?: boolean;
};

@Injectable()
export class FindOneUserUseCase {
  constructor(
    private readonly usersQueriesRepository: UsersQueriesRepository,
  ) {}

  public async execute(userId: string, options?: Options) {
    const user = await this.usersQueriesRepository.findOne(userId, options);

    if (!user) throw new UserNotFoundException();

    return user;
  }
}
