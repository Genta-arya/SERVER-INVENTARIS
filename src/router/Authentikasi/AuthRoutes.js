import express from "express";
import {
  checkLogin,
  handleLogin,
  handleRegister,
} from "../../controllers/Authentikasi/LoginController.js";

const AuthRouter = express.Router();
AuthRouter.post("/login", handleLogin);
AuthRouter.post("/user", checkLogin);
AuthRouter.post("/register", handleRegister);
export default AuthRouter;
