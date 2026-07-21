import { apiClient } from '@/lib/api';
import {
  Feedback,
  FeedbacksAdminParams,
  FeedbacksAdminResponse,
  ReplyFeedbackPayload,
  UpdateFeedbackPayload,
} from '@/types/feedback';

const FEEDBACKS_PATH = '/feedback';

export const feedbacksService = {
  getAdminFeedbacks: async (params: FeedbacksAdminParams) => {
    return apiClient.get<FeedbacksAdminResponse>(
      `${FEEDBACKS_PATH}/allFeedbacks`,
      {
        params,
      },
    );
  },

  approveFeedback: async (id: number) => {
    return apiClient.post<Feedback, Record<string, never>>(
      `${FEEDBACKS_PATH}/approve/${id}`,
      {},
    );
  },

  disapproveFeedback: async (id: number) => {
    return apiClient.post<Feedback, Record<string, never>>(
      `${FEEDBACKS_PATH}/disapprove/${id}`,
      {},
    );
  },

  deleteFeedback: async (id: number) => {
    return apiClient.delete<Feedback>(`${FEEDBACKS_PATH}/${id}`);
  },

  replyFeedback: async (id: number, payload: ReplyFeedbackPayload) => {
    return apiClient.post<Feedback, ReplyFeedbackPayload>(
      `${FEEDBACKS_PATH}/reply/${id}`,
      payload,
    );
  },

  updateFeedback: async (id: number, payload: UpdateFeedbackPayload) => {
    return apiClient.put<Feedback, UpdateFeedbackPayload>(
      `${FEEDBACKS_PATH}/${id}`,
      payload,
    );
  },
};
