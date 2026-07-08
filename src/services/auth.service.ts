import { apiClient } from '@/lib/api';
import { AdminUser, SignInPayload, SignInResponse } from '@/types/auth';

export const authService = {
  signIn: async (payload: SignInPayload) => {
    return apiClient.post<SignInResponse, SignInPayload>(
      '/auth/login',
      payload,
    );
  },

  signOut: async () => {
    return apiClient.post<void>('/auth/logout');
  },

  getMe: async () => {
    return apiClient.get<AdminUser>('/auth/me');
  },
};
