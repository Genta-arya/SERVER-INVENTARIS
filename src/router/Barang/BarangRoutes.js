import express from "express";
import { handlePostBarang } from "../../controllers/Barang/PostBarangController.js";
import { upload } from "../../Config/multer.js";
import { GetBarang, GetSingleBarang } from "../../controllers/Barang/GetBarangController.js";
import { DeleteBarang } from "../../controllers/Barang/DeleteBarangController.js";

const BarangRouter = express.Router();
BarangRouter.post("/barang/upload", upload.single("image"), handlePostBarang);
BarangRouter.get("/barang", GetBarang);
BarangRouter.delete("/barang/:id", DeleteBarang);
BarangRouter.get("/barang/:id", GetSingleBarang);
export default BarangRouter;
