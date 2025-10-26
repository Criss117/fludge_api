import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateEmployeeDto extends CreateUserDto {
  @IsNumber({}, { message: 'El salario debe ser un número' })
  @IsPositive({ message: 'El salario debe ser mayor o igual a 0' })
  salary: number;

  @IsUUID(4, { message: 'Los grupos deben ser UUID v4', each: true })
  @IsOptional()
  groupIds?: string[];
}
