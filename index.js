import express from "express";
import { createServer } from "http";
import cors from "cors";
import path from "path";
import AuthRouter from "./src/router/Authentikasi/AuthRoutes.js";
import BarangRouter from "./src/router/Barang/BarangRoutes.js";
const app = express();
const port = 5001;
const httpServer = createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1",AuthRouter)
app.use("/api/v1",BarangRouter)
app.use("/image", express.static(path.resolve("public", "image")));


httpServer.listen(port, () => {
  console.log("Server running on port " + port);
});
