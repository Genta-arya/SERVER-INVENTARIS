import prisma from "../../../../prisma/Config.js";
import { handleError } from "../../../utils/errorHandler.js";

export const getBarangKeluar = async (req, res) => {
  try {
    const barangKeluar = await prisma.barangKeluar.findMany({
      include: {
        barang: {
          include: {
            permintaan: {
              include: {
                ruangan: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Data barang keluar berhasil diambil",
      data: barangKeluar.reverse(),
    });
  } catch (error) {
    handleError(res, error);
  }
};
