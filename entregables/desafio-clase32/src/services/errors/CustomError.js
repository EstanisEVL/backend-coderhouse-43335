import { HttpResponse } from "../../middlewares/error-handler.js";
import { EnumErrors } from "./errorEnums.js";

export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1, res }) {
    const httpResp = new HttpResponse();

    switch (code) {
      case EnumErrors.ROUTING_ERROR:
      case EnumErrors.INVALID_TYPES_ERROR:
      case EnumErrors.DATABASE_ERROR:
      case EnumErrors.CONTROLLER_ERROR:
      case EnumErrors.INVALID_PARAMS_ERROR:
      case EnumErrors.INVALID_BODY_ERROR:
      case EnumErrors.INVALID_PRICE_ERROR:
        httpResp.BadRequest(res, message, cause);
        break;

      case EnumErrors.INTERNAL_SERVER_ERROR:
        break;

      default:
        httpResp.Error(res, message, cause);
    }
  }
}
