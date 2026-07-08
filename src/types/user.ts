export type UserRole = 'ADMIN' | 'USER' | string;

export type LoyaltyLevel =
  'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | string;

export type User = {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  loyaltyLevel: LoyaltyLevel;
  totalSpentThisYear: number;
  discountPercent: number;
};

export type PaginatedResult<TItem> = {
  data: TItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage?: number;
  };
};

export type UserSearchType = 'phone' | 'email' | 'lastName';

export type GetUsersParams = {
  page: number;
  limit: number;
  phone?: string;
  email?: string;
  lastName?: string;
};

export const USER_SEARCH_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  LAST_NAME: 'lastName',
} as const;

export const translateUserRole = (role: string) => {
  const roles: Record<string, string> = {
    ADMIN: 'Адмін',
    USER: 'Клієнт',
  };

  return roles[role] ?? role;
};

export const translateLoyaltyLevel = (level: string) => {
  const levels: Record<string, string> = {
    NONE: 'Без рівня',
    BRONZE: 'Bronze',
    SILVER: 'Silver',
    GOLD: 'Gold',
    PLATINUM: 'Platinum',
  };

  return levels[level] ?? level;
};

export const getUserRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    ADMIN: 'purple',
    USER: 'blue',
  };

  return colors[role] ?? 'gray';
};

export const getLoyaltyColor = (level: string) => {
  const colors: Record<string, string> = {
    NONE: 'gray',
    BRONZE: 'orange',
    SILVER: 'gray',
    GOLD: 'yellow',
    PLATINUM: 'purple',
  };

  return colors[level] ?? 'gray';
};
