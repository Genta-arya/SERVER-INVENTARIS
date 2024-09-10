import jwt from "jsonwebtoken";
import prisma from "../../prisma/Config.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const AccesEndpoint = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah Authorization header ada dan dimulai dengan 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Silahkan Login" });
    }

    // Ambil token dari Authorization header
    const token = authHeader.split(" ")[1];

    // Cek apakah token ada di database
    const findToken = await prisma.user.findFirst({
      where: { token: token },
    });

    // Jika token tidak ditemukan di database, unauthorized
    if (!findToken) {
      return res.status(401).json({ message: "Silahkan Login" });
    }

    // Jika token ditemukan, lanjutkan dengan verifikasi JWT
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);

        if (err.name === "TokenExpiredError") {
          // Token expired, hapus token dari user di database
          await prisma.user.update({
            where: { id: findToken.id },
            data: { token: null, status: false },
          });

          return res.status(401).json({
            message: "Sesi Telah Habis, Silahkan Login Kembali",
          });
        }

        return res.status(401).json({ message: "Silahkan Login" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
