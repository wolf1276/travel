export interface ApiErrorBody {
  error: string;
  issues?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  issues?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error);
    this.name = 'ApiError';
    this.status = status;
    this.issues = body.issues;
  }
}
