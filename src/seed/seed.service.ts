import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import {
  categories,
  InsertCategory,
  SelectCategory,
} from '@/shared/dbschemas/categories.schema';
import { InsertProduct, products } from '@/shared/dbschemas/products.schema';
import {
  employeeGroups,
  employees,
  type InsertEmployee,
  type InsertEmployeeGroup,
  type SelectEmployee,
} from '@/shared/dbschemas/employees.schema';
import {
  groups,
  type InsertGroup,
  type SelectGroup,
} from '@/shared/dbschemas/groups.schema';
import {
  providers,
  providersProducts,
} from '@/shared/dbschemas/providers.schema';
import {
  businesses,
  type InsertBusiness,
  type SelectBusiness,
} from '@/shared/dbschemas/businesses.schema';
import {
  sessions,
  users,
  type InsertUser,
  type SelectUser,
} from '@/shared/dbschemas/users.schema';
import { faker } from '@faker-js/faker/locale/es';
import { hash } from '@/shared/utils/hash';
import { slugify } from '@/shared/utils/slugify';
import { allPermission } from '@/shared/entities/permissions';

@Injectable()
export class SeedService {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async cleardb() {
    const clearSessions = this.db.delete(sessions);
    const clearEmployeeGroups = this.db.delete(employeeGroups);
    const clearProvidersProducts = this.db.delete(providersProducts);

    await Promise.all([
      clearProvidersProducts,
      clearSessions,
      clearEmployeeGroups,
    ]);

    const clearProducts = this.db.delete(products);
    const clearGroups = this.db.delete(groups);
    const clearEmployees = this.db.delete(employees);
    const clearProviders = this.db.delete(providers);

    await Promise.all([
      clearProducts,
      clearGroups,
      clearEmployees,
      clearProviders,
    ]);

    await this.db.delete(categories);
    await this.db.delete(businesses);
    await this.db.delete(users);
  }

  public async seed() {
    console.log('Limpiando base de datos');
    await this.cleardb();

    console.log('Generando usuarios');
    const createdUsers = await this.seedUsers();

    const employeeUsers = createdUsers.filter((user) => !user.isRoot);
    const rootUsers = createdUsers.filter((user) => user.isRoot);

    console.log('Generando empresas');
    const createdBusinesses = await this.seedBusinesses(
      rootUsers,
      rootUsers.length * 3,
    );

    console.log('Generando grupos');
    const createdGroups = await this.seedGroups(
      createdBusinesses,
      createdBusinesses.length * 5,
    );

    console.log('Generando empleados');
    const createdEmployees = await this.seedEmployees(
      employeeUsers,
      createdBusinesses.flatMap((business) => business.id),
    );

    console.log('Generando grupos de empleados');
    const createdGroupsEmployees = await this.seedGroupsEmployees(
      createdEmployees,
      createdGroups,
    );

    console.log('Generando categorías');
    const createdCategories = await this.seedCategories(
      createdBusinesses.flatMap((business) => business.id),
    );

    console.log('Generando productos');
    const createdProducts = await this.seedProducts(
      createdBusinesses.flatMap((business) => business.id),
      createdCategories,
      createdBusinesses.length * 100,
    );

    console.log('Fin');

    return {
      users: createdUsers,
      businesses: createdBusinesses,
      groups: createdGroups,
      employees: createdEmployees,
      groupsEmployees: createdGroupsEmployees,
      categories: createdCategories,
      products: createdProducts,
    };
  }

  private async seedUsers(totalUsers = 10) {
    const password = await hash('holiwiss');

    const fakerUsers: InsertUser[] = Array.from({ length: totalUsers }).map(
      (_, index) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const isRoot = faker.datatype.boolean();

        return {
          firstName,
          lastName,
          password,
          email: isRoot ? `email${index + 1}@fludge.dev` : undefined,
          username: !isRoot
            ? faker.internet.displayName({
                firstName,
                lastName,
              })
            : undefined,
          isRoot,
          phone: faker.phone.number(),
        };
      },
    );

    return this.db.insert(users).values(fakerUsers).returning();
  }

  private async seedBusinesses(rootUsers: SelectUser[], totalBusinesses = 10) {
    const fakerBusinesses: InsertBusiness[] = Array.from({
      length: totalBusinesses,
    }).map(() => {
      const businessName = faker.company.name();
      const businessSlug = slugify(businessName);

      return {
        name: businessName,
        slug: businessSlug,
        email: faker.internet.email(),
        legalName: faker.company.name() + ' S.A.',
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        nit: faker.finance.iban(),
        rootUserId: faker.helpers.arrayElement(rootUsers).id,
      };
    });

    return this.db.insert(businesses).values(fakerBusinesses).returning();
  }

  private async seedGroups(
    createdBusinesses: SelectBusiness[],
    totalGroups = 10,
  ) {
    const fakerGroups: InsertGroup[] = Array.from({ length: totalGroups }).map(
      (_, index) => {
        const groupName = `${faker.commerce.department()} ${index + 1}`;
        const groupSlug = slugify(groupName);

        return {
          name: groupName,
          slug: groupSlug,
          businessId: faker.helpers.arrayElement(createdBusinesses).id,
          permissions: faker.helpers.arrayElements(allPermission),
          description: faker.lorem.sentence(),
        };
      },
    );

    return this.db.insert(groups).values(fakerGroups).returning();
  }

  private async seedEmployees(
    employeesUsers: SelectUser[],
    businessesIds: string[],
  ) {
    const fakerEmployees: InsertEmployee[] = Array.from({
      length: employeesUsers.length,
    }).map((_, index) => {
      const employeeUser = employeesUsers[index];
      const businessId = faker.helpers.arrayElement(businessesIds);

      return {
        userId: employeeUser.id,
        businessId,
        hireDate: faker.date.past(),
        salary: faker.number.int({ min: 1000000, max: 9999999 }),
        email: faker.internet.email(),
      };
    });

    return this.db.insert(employees).values(fakerEmployees).returning();
  }

  private async seedGroupsEmployees(
    employees: SelectEmployee[],
    groups: SelectGroup[],
  ) {
    const fakerGroupsEmployees: InsertEmployeeGroup[] = Array.from({
      length: employees.length,
    }).map((_, index) => {
      const employee = employees[index];
      const group = faker.helpers.arrayElement(
        groups.filter((group) => group.businessId === employee.businessId),
      );

      return {
        employeeId: employee.id,
        groupId: group.id,
      };
    });

    return this.db
      .insert(employeeGroups)
      .values(fakerGroupsEmployees)
      .returning();
  }

  private async seedCategories(businessesIds: string[], totalCategories = 20) {
    const fakerParentsCategories: InsertCategory[] = Array.from({
      length: totalCategories,
    }).map((_, index) => {
      const businessId = faker.helpers.arrayElement(businessesIds);
      const categoryName = faker.commerce.productName() + ' ' + index;
      const categorySlug = slugify(categoryName);

      return {
        businessId,
        name: categoryName,
        slug: categorySlug,
        description: faker.lorem.sentence(),
      };
    });

    const fakerChildCategories: InsertCategory[] = Array.from({
      length: totalCategories,
    }).map((_, index) => {
      const businessId = faker.helpers.arrayElement(businessesIds);
      const categoryName = faker.commerce.productName() + ' ' + index;
      const categorySlug = slugify(categoryName);

      return {
        businessId,
        name: categoryName,
        slug: categorySlug,
        description: faker.lorem.sentence(),
        parentId: faker.helpers.arrayElement(fakerParentsCategories).id,
      };
    });

    return this.db
      .insert(categories)
      .values([...fakerParentsCategories, ...fakerChildCategories])
      .returning();
  }

  private async seedProducts(
    businessesIds: string[],
    categories: SelectCategory[],
    totalProducts = 100,
  ) {
    const fakerProducts: InsertProduct[] = Array.from({
      length: totalProducts,
    }).map((_, index) => {
      const businessId = faker.helpers.arrayElement(businessesIds);
      const businessCategories = categories.filter(
        (c) => c.businessId === businessId,
      );
      const category =
        businessCategories.length > 0
          ? faker.helpers.arrayElement(
              categories.filter((c) => c.businessId === businessId),
            )
          : null;
      const productName = faker.commerce.productName() + ' ' + index;

      const purchasePrice = faker.number.int({ min: 100, max: 10000 });

      return {
        businessId,
        name: productName,
        slug: slugify(productName),
        barcode: faker.commerce.isbn(),
        categoryId: category?.id || null,
        description: faker.lorem.sentence(),
        minStock: faker.number.int({ min: 0, max: 100 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        purchasePrice,
        salePrice: Math.round(purchasePrice * 0.25),
        offerPrice: Math.round(purchasePrice * 0.2),
        wholesalePrice: Math.round(purchasePrice * 0.15),
        allowNegativeStock: faker.datatype.boolean(),
      };
    });

    return this.db.insert(products).values(fakerProducts).returning();
  }
}
