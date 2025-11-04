import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { CreateUserUseCase } from '@/users/usecases/create-user.usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public async execute(values: CreateUserDto) {
    await this.createUserUseCase.execute({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      isRoot: true,
    });
  }
}
