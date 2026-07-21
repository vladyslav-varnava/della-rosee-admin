'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { feedbacksKeys } from '@/hooks/query/useFeedbacksAdmin';
import { feedbacksService } from '@/services/feedbacks.service';
import {
  ReplyFeedbackPayload,
  UpdateFeedbackPayload,
} from '@/types/feedback';

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Спробуйте ще раз';
};

export const useApproveFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feedbacksService.approveFeedback(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: feedbacksKeys.adminLists(),
      });

      toaster.create({
        title: 'Відгук опубліковано',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Не вдалося опублікувати відгук',
        description: getErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export const useDisapproveFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feedbacksService.disapproveFeedback(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: feedbacksKeys.adminLists(),
      });

      toaster.create({
        title: 'Відгук приховано',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Не вдалося приховати відгук',
        description: getErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feedbacksService.deleteFeedback(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: feedbacksKeys.adminLists(),
      });

      toaster.create({
        title: 'Відгук видалено',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Не вдалося видалити відгук',
        description: getErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export const useReplyFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
                   id,
                   payload,
                 }: {
      id: number;
      payload: ReplyFeedbackPayload;
    }) => feedbacksService.replyFeedback(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: feedbacksKeys.adminLists(),
      });

      toaster.create({
        title: 'Відповідь додано',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Не вдалося додати відповідь',
        description: getErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export const useUpdateFeedbackReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
                   id,
                   payload,
                 }: {
      id: number;
      payload: UpdateFeedbackPayload;
    }) => feedbacksService.updateFeedback(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: feedbacksKeys.adminLists(),
      });

      toaster.create({
        title: 'Відповідь оновлено',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Не вдалося оновити відповідь',
        description: getErrorMessage(error),
        type: 'error',
      });
    },
  });
};
