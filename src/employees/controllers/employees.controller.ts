import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../usecases/create-employee.usecase';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { FindOneEmployeeUseCase } from '../usecases/find-one-employee.usecase';

@Controller('businesses/:businessSlug/employees')
export class EmployeesController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly findOneEmployeeUseCase: FindOneEmployeeUseCase,
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
}
