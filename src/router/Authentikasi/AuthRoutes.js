import express from "express";
import {
  checkLogin,
  getUser,
  handleDeleteUser,
  handleLogin,
  handleLogout,
  handleRegister,
  updateDataNameUser,
} from "../../controllers/Authentikasi/LoginController.js";
import { upload } from "../../Config/Firebase.js";

const AuthRouter = express.Router();
AuthRouter.post("/login", handleLogin);
AuthRouter.post("/user", checkLogin);
AuthRouter.get("/user", getUser);
AuthRouter.post("/register", handleRegister);
AuthRouter.post("/logout", handleLogout);
AuthRouter.delete("/user/:id", handleDeleteUser);
AuthRouter.put("/user/name/:id", updateDataNameUser);
AuthRouter.post("/user/avatar/:id" ,upload.single("image"), checkLogin);
export default AuthRouter;
