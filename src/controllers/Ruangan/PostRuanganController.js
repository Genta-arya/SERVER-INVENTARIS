import prisma from "../../../prisma/Config.js";
import { handleError } from "./../../utils/errorHandler.js";

export const addRuangan = async (req, res) => {
  const { namaRuangan } = req.body;

  if (!namaRuangan) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const findName = await prisma.ruangan.findFirst({
      where: {
        nama: namaRuangan,
      },
    });
    if (findName) {
      return res.status(400).json({ message: "Nama Ruangan sudah ada" });
    } else {
      const createRuangan = await prisma.ruangan.create({
        data: {
          nama: namaRuangan,
        },
      });
      return res.status(200).json({ data: createRuangan });
    }
  } catch (error) {
    handleError(res, error);
  }
};
