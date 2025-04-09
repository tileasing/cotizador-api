export type BaseResponseType<T = any> = {
  success: boolean;
  data?: T;
  errors?: string[];
};
