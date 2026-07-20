import { apiClient } from '@/lib/api';
import {
  GetUsersParams,
  PaginatedResult,
  UpdateUserAdminPayload,
  User,
} from '@/types/user';

const USERS_PATH = '/user';

export const usersService = {
  getUsers: async (params: GetUsersParams) => {
    return apiClient.get<PaginatedResult<User>>(`${USERS_PATH}/list`, {
      params,
    });
  },
  getUserById: async (id: number) => {
    return apiClient.get<User>(`${USERS_PATH}/${id}`);
  },

  updateUserAdmin: async (id: number, payload: UpdateUserAdminPayload) => {
    return apiClient.put<User, UpdateUserAdminPayload>(
      `${USERS_PATH}/admin/${id}`,
      payload,
    );
  },
};
