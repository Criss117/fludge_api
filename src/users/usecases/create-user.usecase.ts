import { Injectable } from '@nestjs/common';
import { UsersQueriesRepository } from '../repositories/users-queries.repository';
import { UsersCommandsRepository } from '../repositories/users-commands.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { hash } from '@/shared/utils/hash';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersQueriesRepository: UsersQueriesRepository,
    private readonly usersCommandsRepository: UsersCommandsRepository,
  ) {}

  public async execute(values: CreateUserDto, isRoot: 'isRoot' | 'isEmployee') {
    const exisitingUser = await this.usersQueriesRepository.findOneBy({
      email: values.email,
    });

    if (exisitingUser) throw new UserAlreadyExistsException();

    const hashedPassword = await hash(values.password);

    await this.usersCommandsRepository.save({
      ...values,
      isRoot: isRoot === 'isRoot',
      password: hashedPassword,
    });
  }
}
