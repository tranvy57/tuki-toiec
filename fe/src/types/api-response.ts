export interface ApiResponse<T> {
  data: T | null;
  statusCode: number;
  message: string;
}
