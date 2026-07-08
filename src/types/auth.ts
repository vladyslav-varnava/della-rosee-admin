export type SignInPayload = {
  email: string;
  password: string;
};

export type AdminUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type SignInResponse = {
  user?: AdminUser;
  accessToken?: string;
};
