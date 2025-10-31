import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class EnsureEmployeeIdsDto {
  @IsArray({
    message: 'Los empleados deben ser una lista',
  })
  @IsNotEmpty({
    message: 'Los empleados no pueden estar vacios',
  })
  @IsString({
    each: true,
    message: 'Los empleados deben ser cadenas de caracteres',
  })
  employeeIds: string[];
}
