
export const PermissionMap = {
  TRADES: ['create', 'create-manual'] as const,
  INVENTORY: ['create', 'read', 'update', 'delete'] as const,
};

export type Module = keyof typeof PermissionMap;

export type Action<M extends Module> = typeof PermissionMap[M][number];

export interface Permission<M extends Module = Module> {
  module: M;
  action: Action<M>;
}