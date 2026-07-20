import { Address } from '@/types/delivery';
import { Order } from '@/types/order';

export type UserRole = 'ADMIN' | 'USER' | string;

export const LOYALTY_LEVEL = {
  NONE: 'NONE',
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;

export type LoyaltyLevel = (typeof LOYALTY_LEVEL)[keyof typeof LOYALTY_LEVEL];

export const loyaltyLevelOptions = [
  { label: 'Без рівня', value: LOYALTY_LEVEL.NONE },
  { label: 'Bronze', value: LOYALTY_LEVEL.BRONZE },
  { label: 'Silver', value: LOYALTY_LEVEL.SILVER },
  { label: 'Gold', value: LOYALTY_LEVEL.GOLD },
  { label: 'Platinum', value: LOYALTY_LEVEL.PLATINUM },
];

export const translateLoyaltyLevel = (level?: string) => {
  const levels: Record<string, string> = {
    NONE: 'Без рівня',
    BRONZE: 'Bronze',
    SILVER: 'Silver',
    GOLD: 'Gold',
    PLATINUM: 'Platinum',
  };

  return levels[level ?? ''] ?? level ?? '—';
};

export const getLoyaltyLevelColor = (level?: string) => {
  const colors: Record<string, string> = {
    NONE: 'gray',
    BRONZE: 'orange',
    SILVER: 'gray',
    GOLD: 'yellow',
    PLATINUM: 'purple',
  };

  return colors[level ?? ''] ?? 'gray';
};

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
  addresses?: Address[];
  orders?: Order[];
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

export type UpdateUserAdminPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  loyaltyLevel?: LoyaltyLevel;
  totalSpentThisYear?: number;
};
