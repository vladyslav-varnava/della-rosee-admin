'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api';
import { authService } from '@/services/auth.service';
import { SignInPayload } from '@/types/auth';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (payload: SignInPayload) => authService.signIn(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.all,
      });

      router.replace('/orders');
      router.refresh();
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: async () => {
      queryClient.clear();

      router.replace('/login');
      router.refresh();
    },
  });

  const signInError =
    signInMutation.error instanceof ApiError
      ? signInMutation.error.message
      : signInMutation.error?.message;

  return {
    signIn: (email: string, password: string) => {
      signInMutation.mutate({
        email,
        password,
      });
    },

    signInAsync: signInMutation.mutateAsync,

    signOut: signOutMutation.mutate,

    isLoading: signInMutation.isPending,
    isSignOutLoading: signOutMutation.isPending,

    error: signInError,
    isError: signInMutation.isError,
  };
};
