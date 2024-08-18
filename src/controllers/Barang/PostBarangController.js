import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";
import path from "path";
import fs from "fs/promises";
import QRCode from "qrcode";

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001'; 
const URL_QR = "192.168.0.2:5173"
export const handlePostBarang = async (req, res) => {
  const {
    kodeBarang,
    namaBarang,
    nomorRegister,
    merkType,
    ukuran,
    qty,
    jenis,
    hargaBarang,
    kondisi,
    perolehan,
    ruanganId, 
  } = req.body;


  const foto = req.file ? `${BASE_URL}/image/${req.file.filename}` : null;
  const uploadedFilePath = req.file ? path.join('public', 'image', req.file.filename) : null;

  try {

    const newBarang = await prisma.barang.create({
      data: {
        kodeBarang,
        namaBarang,
        nomorRegister,
        merkType,
        ukuran,
        jenis,
        qty: parseInt(qty),
        tahun: new Date().getFullYear(),
        hargaBarang: parseInt(hargaBarang),
        kondisi,
        foto,
        perolehan,
     
        ...(ruanganId ? { ruanganId } : {}),
      },
    });

   
    const imageFolderPath = path.join('public', 'image');

  
    try {
      await fs.access(imageFolderPath);
    } catch (error) {
  
      await fs.mkdir(imageFolderPath, { recursive: true });
    }

   
    const qrCodeData = `${URL_QR}/detail/${newBarang.id}`;
    const qrCodeImage = await QRCode.toBuffer(qrCodeData, {
      errorCorrectionLevel: 'H', 
      type: 'png',
      width: 300,
    });

 
    const qrCodeImagePath = path.join(imageFolderPath,`${namaBarang}-${newBarang.id}.png`);
    await fs.writeFile(qrCodeImagePath, qrCodeImage);

  
    const qrCodeURL = `${BASE_URL}/image/${namaBarang}-${newBarang.id}.png`;
    const updatedBarang = await prisma.barang.update({
      where: { id: newBarang.id },
      data: { imageBarcode: qrCodeURL }, 
    });


    res.status(201).json(updatedBarang);
  } catch (error) {
    
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (unlinkError) {
        console.error("Failed to delete uploaded file:", unlinkError);
      }
    }

    
    handleError(res, error);
  }
};
