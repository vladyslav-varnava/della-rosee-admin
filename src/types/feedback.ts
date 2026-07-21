export interface Feedback {
  id: number;
  slug: string;
  name: string;
  productId: number;
  mobile?: string;
  email: string;
  message: string;
  averageRating: number;
  mediaLinks: string[];
  likesCount: number;
  isApproved: boolean;
  createdAt: Date;
  userId?: number;
  parentId?: number;
  replies?: Feedback[];
  likedBy?: { id: number }[];
}

export type FeedbacksAdminParams = {
  take: number;
  skip: number;
};

export type FeedbacksAdminResponse = {
  items: Feedback[];
  paging: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type ReplyFeedbackPayload = {
  productId: number;
  email: string;
  name: string;
  message: string;
  averageRating: number;
  isApproved: boolean;
};

export type UpdateFeedbackPayload = {
  message: string;
};
