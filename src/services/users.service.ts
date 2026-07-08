import { apiClient } from '@/lib/api';
import { GetUsersParams, PaginatedResult, User } from '@/types/user';

const USERS_PATH = '/user';

export const usersService = {
  getUsers: async (params: GetUsersParams) => {
    return apiClient.get<PaginatedResult<User>>(`${USERS_PATH}/list`, {
      params,
    });
  },
};
