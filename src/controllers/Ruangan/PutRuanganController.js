import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";

export const updateNamaRuangan = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (!nama) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Cek apakah nama ruangan sudah ada di database dan bukan untuk id yang sedang diupdate
    const existingRuangan = await prisma.ruangan.findFirst({
      where: {
        nama: nama,
        NOT: {
          id: parseInt(id) || id, // Mengecualikan id yang sedang diupdate
        },
      },
    });

    if (existingRuangan) {
      return res.status(400).json({ message: "Nama ruangan sudah ada, silakan pilih nama yang lain" });
    }

  
    const updateRuangan = await prisma.ruangan.update({
      where: {
        id: parseInt(id) || id,
      },
      data: {
        nama: nama,
      },
    });

    return res.status(200).json({ data: updateRuangan });
  } catch (error) {
    handleError(res, error);
  }
};



