import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../usecases/create-employee.usecase';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';
import { Permissions } from '@/auth/decorators/permissions.decorator';

@Controller('businesses/:businessSlug/employees')
export class EmployeesController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

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
}
