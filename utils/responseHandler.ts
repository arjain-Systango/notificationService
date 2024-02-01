import { Response } from 'express';

class ResponseHandler {
  async sendResponse(
    statusCode: number,
    data: any,
    success: boolean,
    res: Response,
    isError?: boolean,
  ) {
    if (typeof data === 'string') {
      return res.status(statusCode).json({ success, message: data });
    }
    if (isError) {
      return res.status(statusCode).json({ success, error: data });
    }
    return res.status(statusCode).json({ success, data });
  }
}

const responseHandler: ResponseHandler = new ResponseHandler();
export default responseHandler;
