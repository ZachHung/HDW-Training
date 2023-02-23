export class AppError extends Error {
  status_code: number;
  data: Record<string, unknown>;

  constructor(status_code: number, message: string, data: Record<string, unknown>) {
    super();
    this.message = message;
    this.status_code = status_code;
    this.data = data;
  }
}

export const createError = (
  status_code: number,
  message: string,
  data: Record<string, unknown> = {},
): AppError => {
  return new AppError(status_code, message, data);
};
