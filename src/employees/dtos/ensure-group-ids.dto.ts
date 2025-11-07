import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnsureGroupIdsDto {
  @IsUUID(7, {
    each: true,
    message: 'Los ids de grupo deben ser UUID v4',
  })
  @IsNotEmpty({
    message: 'Los ids de grupo no pueden estar vacios',
  })
  groupIds: string[];
}
