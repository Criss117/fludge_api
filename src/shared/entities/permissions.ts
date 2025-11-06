export const resources = [
  'employees',
  'groups',
  'products',
  'providers',
  'categories',
  'clients',
] as const;
export const actions = ['create', 'read', 'update', 'delete'] as const;

export type Resource = (typeof resources)[number];
export type Action = (typeof actions)[number];

export type Permission =
  | `${Resource}:${Action}`
  | 'businesses:update'
  | 'businesses:read';

export const allPermission: Permission[] = [
  'employees:create',
  'employees:read',
  'employees:update',
  'employees:delete',

  'groups:create',
  'groups:read',
  'groups:update',
  'groups:delete',

  'products:create',
  'products:read',
  'products:update',
  'products:delete',

  'providers:create',
  'providers:read',
  'providers:update',
  'providers:delete',

  'clients:create',
  'clients:read',
  'clients:update',
  'clients:delete',

  'categories:create',
  'categories:read',
  'categories:update',
  'categories:delete',

  'businesses:update',
] as const;
