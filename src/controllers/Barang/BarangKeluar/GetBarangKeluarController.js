import prisma from "../../../../prisma/Config.js";
import { handleError } from "../../../utils/errorHandler.js";

// Fungsi untuk mendapatkan waktu di Indonesia (WIB, UTC+7)
export const getIndonesianDate = () => {
  const now = new Date();
  
  const offset = 7; 
  const indonesianTime = new Date(now.getTime() + offset * 60 * 60 * 1000);
  return indonesianTime;
};

export const getBarangKeluar = async (req, res) => {
  let { date } = req.body;


  if (!date) {
    const today = getIndonesianDate();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 

    date = { gte: startOfDay, lt: endOfDay };
  } else {
    const specifiedDate = new Date(date);
    const startOfDay = new Date(specifiedDate.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(specifiedDate.setHours(23, 59, 59, 999)); 

    date = { gte: startOfDay, lt: endOfDay };
  }

  try {
    const barangKeluar = await prisma.barangKeluar.findMany({
      where: {
        tanggal: date, 
      },
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
