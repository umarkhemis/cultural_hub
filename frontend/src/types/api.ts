
export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code?: string;
    details?: Array<Record<string, unknown>>;
  };
};