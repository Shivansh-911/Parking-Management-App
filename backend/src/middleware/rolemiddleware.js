import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.auth.role)) {
        throw new ApiError(403, "Access denied. Insufficient permissions.");
      }
      next();
    } catch (error) {
      next(error); 
    }
  };
};
