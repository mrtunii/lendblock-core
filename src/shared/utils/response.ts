import { ResponseCode } from './response-codes.enum';

export class Response {
  code: ResponseCode;
  description: string | null;
  message: string | null;
  validationErrors: any;
  data: any;
  timestamp: number;

  constructor() {
    this.message = null;
    this.data = null;
    this.description = null;
    this.code = ResponseCode.OK;
    this.timestamp = new Date().getTime();
  }

  setData(data: any, flagResponseAsSuccessful = true) {
    this.message = 'Request processed successfully.';
    this.data = data;
    if (flagResponseAsSuccessful) {
      this.code = ResponseCode.OK;
    }
  }

  setError(err: string | null, errorCode?: ResponseCode, data?: any) {
    this.message = err;
    this.code = errorCode || ResponseCode.Error;
    this.data = data;
  }

  setValidationErrors(errors: any) {
    this.message = 'We have a problem with your input';
    this.code = ResponseCode.UnprocessableEntity;
    this.validationErrors = errors.details.map((r: any) => {
      return {
        field: r.context.label,
        message: r.message,
      };
    });
  }
}
