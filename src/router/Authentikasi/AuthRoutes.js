import express from "express";
import {
  checkLogin,
  getUser,
  handleDeleteUser,
  handleLogin,
  handleLogout,
  handleRegister,
} from "../../controllers/Authentikasi/LoginController.js";

const AuthRouter = express.Router();
AuthRouter.post("/login", handleLogin);
AuthRouter.post("/user", checkLogin);
AuthRouter.get("/user", getUser);
AuthRouter.post("/register", handleRegister);
AuthRouter.post("/logout", handleLogout);
AuthRouter.delete("/user/:id", handleDeleteUser);
export default AuthRouter;
