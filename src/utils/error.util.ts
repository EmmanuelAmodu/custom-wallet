import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { errorMessages, ERROR_CODES } from './constants';

export class ErrorResponse {
  badRequest(errorCode: ERROR_CODES, data?: any) {
    throw new BadRequestException({
      code: errorCode,
      errMsg:
        errorMessages[ERROR_CODES[errorCode]] ||
        'There was an error completing this request',
      stacktrace: data,
    });
  }

  serverError(errorCode: ERROR_CODES, data?: any) {
    throw new InternalServerErrorException({
      code: errorCode,
      errMsg:
        errorMessages[ERROR_CODES[errorCode]] ||
        'An Error Occured. We are looking into it',
      stacktrace: data,
    });
  }

  notFound(errorCode: ERROR_CODES, data?: any) {
    throw new NotFoundException({
      code: errorCode,
      errMsg: errorMessages[ERROR_CODES[errorCode]] || 'Resource Not Found',
      stacktrace: data,
    });
  }
}
