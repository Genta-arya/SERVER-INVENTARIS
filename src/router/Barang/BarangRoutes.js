import express from "express";
import {
  handleEditBarang,
  handlePostBarang,
} from "../../controllers/Barang/PostBarangController.js";

import {
  GetBarang,
  GetSingleBarang,
} from "../../controllers/Barang/GetBarangController.js";
import { DeleteBarang } from "../../controllers/Barang/DeleteBarangController.js";
import { upload } from "../../Config/Firebase.js";
import { PostReturBarang } from "../../controllers/Retur/PostReturBarang.js";
import { getBarangKeluar } from "../../controllers/Barang/BarangKeluar/GetBarangKeluarController.js";
import { getBarangMasuk, UpdateBarangMasuk } from "../../controllers/Barang/BarangMasuk/PostBarangMasukController.js";

const BarangRouter = express.Router();
BarangRouter.post("/barang/upload", upload.single("image"), handlePostBarang);
BarangRouter.get("/barang", GetBarang);
BarangRouter.post("/barang/keluar", getBarangKeluar);
BarangRouter.put("/barang/:id", handleEditBarang);
BarangRouter.delete("/barang/:id", DeleteBarang);
BarangRouter.get("/barang/:id", GetSingleBarang);
BarangRouter.post("/retur/barang", PostReturBarang);
BarangRouter.post("/barang/masuk", UpdateBarangMasuk);
BarangRouter.post("/filter/barang/masuk", getBarangMasuk);
export default BarangRouter;
