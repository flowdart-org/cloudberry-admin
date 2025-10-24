export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.CUSTOMER]: 'Customer',
};
