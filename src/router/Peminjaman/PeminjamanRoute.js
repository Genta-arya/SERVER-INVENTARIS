import express from "express";
import {
  getPeminjaman,
  PostPeminjaman,
  ReturPeminjaman,
  updateStatusPeminjaman,
} from "../../controllers/Peminjaman/PostPeminjamanController.js";

const PeminjamanRouter = express.Router();

PeminjamanRouter.post("/peminjaman", PostPeminjaman);
PeminjamanRouter.put("/peminjaman", updateStatusPeminjaman);
PeminjamanRouter.put("/retur/peminjaman", ReturPeminjaman);
PeminjamanRouter.post("/filter/peminjaman", getPeminjaman);

export default PeminjamanRouter;
