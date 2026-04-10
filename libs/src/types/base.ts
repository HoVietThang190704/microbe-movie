export interface BaseResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
  error?: string;
}
