import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SignInDto } from '../dtos/sign-in.dto';
import { SessionsCommandsRepository } from '../repositories/sessions-commands.repository';
import { FindOneUserByUseCase } from '@/users/usecases/find-one-user-by.usecase';
import { compare } from '@/shared/utils/hash';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { expirationDate } from '@/shared/utils/expiration-date';
import { UserSummary } from '@/shared/entities/user.entity';
import { SignInEmployeeDto } from '../dtos/sign-in-employee.dto';

type Metadata = {
  userAgent?: string;
};

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly sessionsCommandsRepository: SessionsCommandsRepository,
    private readonly findOneUserByUseCase: FindOneUserByUseCase,
  ) {}

  public async rootUser(values: SignInDto, meta: Metadata) {
    const user = await this.findOneUserByUseCase.execute({
      email: values.email,
    });

    await this.ensureCredentials(user, values.password);

    return this.createSession(user, meta);
  }

  public async employeeUser(values: SignInEmployeeDto, meta: Metadata) {
    const user = await this.findOneUserByUseCase.execute({
      username: values.username,
    });

    await this.ensureCredentials(user, values.password);

    return this.createSession(user, meta);
  }

  private async ensureCredentials(user: UserSummary, password: string) {
    if (!user.password) throw new InvalidCredentialsException();

    const comparePassword = await compare(password, user.password);

    if (!comparePassword) throw new InvalidCredentialsException();
  }

  private async createSession(user: UserSummary, meta: Metadata) {
    const session = await this.sessionsCommandsRepository.saveAndReturn({
      userId: user.id,
      token: randomBytes(32).toString('hex'),
      userAgent: meta.userAgent,
      expiresAt: expirationDate(), // 24 hours,
    });

    if (!session)
      throw new InternalServerErrorException('Error al crear la sesión');

    return session;
  }
}
