import { HttpStatus } from '@nestjs/common';

export interface CommonResponse<T> {
  message: string;
  statusCode: HttpStatus;
  error?: string;
  data: T | null;
}

export class HTTPResponse {
  public static noContent<T>(message: string): CommonResponse<T> {
    return {
      message,
      statusCode: HttpStatus.NO_CONTENT,
      data: null,
    };
  }

  public static ok<T = null>(message: string, data?: T): CommonResponse<T> {
    return {
      message,
      statusCode: HttpStatus.OK,
      data: data || null,
    };
  }

  public static created<T>(message: string, data?: T): CommonResponse<T> {
    return {
      message,
      statusCode: HttpStatus.CREATED,
      data: data || null,
    };
  }
}
