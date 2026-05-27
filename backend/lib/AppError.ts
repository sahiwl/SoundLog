export class AppError extends Error {
  message: string;
  statusCode: number;
  isOperational: boolean;
  details: unknown;

  constructor(message: string, statusCode:number = 400, details:unknown = null) {
    super(message);
    this.name  = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
  }
}
