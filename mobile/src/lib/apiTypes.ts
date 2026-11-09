export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  instance?: string;
  requestId?: string;
  fieldErrors?: { field: string; code: string; message: string }[];
  context?: Record<string, unknown>;
}
