import { StatusCodes } from "http-status-codes";
import { EnumErrors } from "../services/errors/errorEnums.js";
import { HttpResponse } from "./error-handler.js";

const httpResp = new HttpResponse();

export default (err, req, res, next) => {
  console.log(err.cause);
  const errStatusCode = err.errStatusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errMessage = err.message || "Error";
  switch (err.code) {
    case EnumErrors.ROUTING_ERROR:
    case EnumErrors.INVALID_TYPES_ERROR:
    case EnumErrors.DATABASE_ERROR:
    case EnumErrors.CONTROLLER_ERROR:
    case EnumErrors.INVALID_PARAMS_ERROR:
    case EnumErrors.INVALID_BODY_ERROR:
    case EnumErrors.INVALID_PRICE_ERROR:
    case EnumErrors.INTERNAL_SERVER_ERROR:
      httpResp.Error(res, errMessage, null);
      break;

    default:
      httpResp.Error(res, "Unhandled error.", null);
  }
};
