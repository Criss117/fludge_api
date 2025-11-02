import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../usecases/create-employee.usecase';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { FindOneEmployeeUseCase } from '../usecases/find-one-employee.usecase';
import { AssignGroupsToEmployeeUseCase } from '../usecases/assign-groups-to-employee.usecase';
import { RemoveGroupsFromEmployeeUseCase } from '../usecases/remove-groups-from-employee.usecase';
import { EnsureGroupIdsDto } from '../dtos/ensure-group-ids.dto';

@Controller('businesses/:businessSlug/employees')
export class EmployeesController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly findOneEmployeeUseCase: FindOneEmployeeUseCase,
    private readonly assignGroupsToEmployeeUseCase: AssignGroupsToEmployeeUseCase,
    private readonly removeGroupsFromEmployeeUseCase: RemoveGroupsFromEmployeeUseCase,
  ) {}

  @Post()
  @Permissions('employees:create')
  public async createEmployee(
    @GetBusiness('id') businessId: string,
    @Body() values: CreateEmployeeDto,
  ) {
    await safeAction(
      () => this.createEmployeeUseCase.execute(businessId, values),
      'Error al crear el empleado',
    );

    return HTTPResponse.created('Empleado creado correctamente');
  }

  @Get(':employeeId')
  @Permissions('employees:read')
  public async findOne(
    @GetBusiness('id') businessId: string,
    @Param('employeeId') employeeId: string,
  ) {
    const res = await safeAction(() =>
      this.findOneEmployeeUseCase.execute(businessId, employeeId),
    );

    return HTTPResponse.ok('Empleado encontrado', res);
  }

  @Post(':employeeId/groups')
  @Permissions('employees:update', 'groups:update')
  public async assignGroups(
    @GetBusiness('id') businessId: string,
    @Param('employeeId') employeeId: string,
    @Body() values: EnsureGroupIdsDto,
  ) {
    await safeAction(() =>
      this.assignGroupsToEmployeeUseCase.execute(
        businessId,
        employeeId,
        values,
      ),
    );

    return HTTPResponse.created('Grupos asignados correctamente');
  }

  @Delete(':employeeId/groups')
  @Permissions('employees:update', 'groups:update')
  public async removeGroups(
    @GetBusiness('id') businessId: string,
    @Param('employeeId') employeeId: string,
    @Body() values: EnsureGroupIdsDto,
  ) {
    await safeAction(() =>
      this.removeGroupsFromEmployeeUseCase.execute(
        businessId,
        employeeId,
        values,
      ),
    );

    return HTTPResponse.ok('Grupos eliminados correctamente');
  }
}
