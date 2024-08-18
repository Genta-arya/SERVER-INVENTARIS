import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";

export const GetBarang = async (req, res) => {
  try {
    const findAllBarang = await prisma.barang.findMany({
      include: {
        ruangan: true, 
      },
    });

 
    res.status(200).json({data:findAllBarang});
  } catch (error) {
    handleError(res, error);
  }
};


export const GetSingleBarang = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const findOneBarang = await prisma.barang.findUnique({
      where: { id: id },
      include: {
        ruangan: true,
      },
    });
 
    res.status(200).json({ data: findOneBarang });
  } catch (error) {
    handleError(res, error);
  }
}