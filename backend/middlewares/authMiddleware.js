import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = {id: user._id, role: user.role};
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401);
        err.message = "Token expired. Please log in again.";
      } else if (err.name === "JsonWebTokenError") {
        res.status(401);
        err.message = "Invalid token.";
      }

      next(err);
    }
  } else {
    res.status(401);
    next(new Error("Authorization token missing or malformed"));
  }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403);
            throw new Error("Unauthorized");
        }

        next();
    }
}

export {protect, authorizeRoles};
