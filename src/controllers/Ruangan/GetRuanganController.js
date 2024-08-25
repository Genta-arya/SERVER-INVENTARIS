import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";

export const GetAllRuangan = async (req, res) => {
  try {
    const findAllRuangan = await prisma.ruangan.findMany({
      include: {
        inventaris: {
          include: { barang: true },
        },
      },
    });
    res.status(200).json({ data: findAllRuangan });
  } catch (error) {
    handleError(res, error);
  }
};

export const GetSingleRuangan = async (req, res) => {
  const { id } = req.params;
  try {
    const findOneRuangan = await prisma.ruangan.findUnique({
      where: { id: parseInt(id) },
      include: {
        // inventaris: {
        //   include: { barang: true },
        // },
        permintaan: {
          include: { barang: {
            include:{
              inventaris: true
            }
          } },
        },
      },
    });
    if (!findOneRuangan) {
      return res.status(404).json({ message: "Ruangan tidak ditemukan" });
    }
    res.status(200).json({ data: findOneRuangan });
  } catch (error) {
    handleError(res, error);
  }
}