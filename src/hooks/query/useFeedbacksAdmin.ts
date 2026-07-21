'use client';

import { useQuery } from '@tanstack/react-query';

import { feedbacksService } from '@/services/feedbacks.service';

type Params = {
  page: number;
  take: number;
};

export const feedbacksKeys = {
  all: ['feedbacks'] as const,
  adminLists: () => [...feedbacksKeys.all, 'admin-list'] as const,
  adminList: (params: Params) =>
    [...feedbacksKeys.adminLists(), params.page, params.take] as const,
};

export const useFeedbacksAdmin = ({ page, take }: Params) => {
  const skip = (page - 1) * take;

  return useQuery({
    queryKey: feedbacksKeys.adminList({ page, take }),
    queryFn: () =>
      feedbacksService.getAdminFeedbacks({
        take,
        skip,
      }),
    staleTime: 1000 * 60,
  });
};
