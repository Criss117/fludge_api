import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_PERMISSIONS } from '../decorators/permissions.decorator';
import { Permission } from '@/shared/entities/permissions';
import { UserDetail } from '@/shared/entities/user.entity';
import { FindOneBusinessUseCase } from '@/businesses/usecases/find-one-business.usecase';
import { UserNotRootOrEmployeeException } from '../exceptions/user-not-root-or-employee.exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly findOneBusinessUseCase: FindOneBusinessUseCase,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const url = req.url as string;

    if (!url.includes('businesses'))
      throw new InternalServerErrorException(
        'Url no tiene el formato correcto',
      );

    const permissions: Permission[] = this.reflector.get(
      META_PERMISSIONS,
      context.getHandler(),
    );

    if (!permissions.length)
      throw new InternalServerErrorException('Permisos no encontrados');

    const user = req.user as UserDetail;
    const businessSlug = req.params.businessSlug as string;

    if (!user) throw new InternalServerErrorException('Usuario no encontrado');
    if (!businessSlug)
      throw new InternalServerErrorException('Slug de negocio no encontrado');

    const business = await this.findOneBusinessUseCase.execute(
      {
        slug: businessSlug,
      },
      user.id,
    );

    const userIsRootOrEmployeeInBusiness =
      business.rootUserId === user.id ||
      business.employees.some((e) => e.id === user.id);

    if (!userIsRootOrEmployeeInBusiness)
      throw new UserNotRootOrEmployeeException();

    req.business = business;

    if (user.isRoot) return true;
    //Here the user is an employee in the business

    const permissionsWitoutBusinesses = permissions.filter((p) =>
      p.includes('businesses'),
    );

    const userPermissions = user.isEmployeeIn?.groups.map((g) => g.permissions);

    if (!userPermissions?.length)
      throw new ForbiddenException('No tiene permisos para hacer esto');

    const userHasPermissions = permissionsWitoutBusinesses.some((p) =>
      userPermissions.some((up) => up.includes(p)),
    );

    if (!userHasPermissions)
      throw new ForbiddenException('No tiene permisos para hacer esto');

    return true;
  }
}
