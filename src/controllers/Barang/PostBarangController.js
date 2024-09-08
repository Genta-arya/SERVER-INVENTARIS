import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";
import path from "path";
import fs from "fs/promises";
import QRCode from "qrcode";
import { storage } from "../../Config/Firebase.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import formidable from "formidable";
const BASE_URL = process.env.BASE_URL || "http://localhost:5001";
const URL_QR = "https://web-invetaris.vercel.app/";
// export const handlePostBarang = async (req, res) => {
//   const {
//     kodeBarang,
//     namaBarang,
//     nomorRegister,
//     merkType,
//     ukuran,
//     qty,
//     jenis,
//     hargaBarang,
//     kondisi,
//     perolehan,
//     ruanganId,
//   } = req.body;

//   const foto = req.file ? `${BASE_URL}/image/${req.file.filename}` : null;
//   const uploadedFilePath = req.file ? path.join('public', 'image', req.file.filename) : null;

//   try {

//     const newBarang = await prisma.barang.create({
//       data: {
//         kodeBarang,
//         namaBarang,
//         nomorRegister,
//         merkType,
//         ukuran,
//         jenis,
//         qty: parseInt(qty),
//         tahun: new Date().getFullYear(),
//         hargaBarang: parseInt(hargaBarang),
//         kondisi,
//         foto,
//         perolehan,

//         ...(ruanganId ? { ruanganId } : {}),
//       },
//     });

//     const imageFolderPath = path.join('public', 'image');

//     try {
//       await fs.access(imageFolderPath);
//     } catch (error) {

//       await fs.mkdir(imageFolderPath, { recursive: true });
//     }

//     const qrCodeData = `${URL_QR}/detail/${newBarang.id}`;
//     const qrCodeImage = await QRCode.toBuffer(qrCodeData, {
//       errorCorrectionLevel: 'H',
//       type: 'png',
//       width: 300,
//     });

//     const qrCodeImagePath = path.join(imageFolderPath,`${namaBarang}-${newBarang.id}.png`);
//     await fs.writeFile(qrCodeImagePath, qrCodeImage);

//     const qrCodeURL = `${BASE_URL}/image/${namaBarang}-${newBarang.id}.png`;
//     const updatedBarang = await prisma.barang.update({
//       where: { id: newBarang.id },
//       data: { imageBarcode: qrCodeURL },
//     });

//     res.status(201).json(updatedBarang);
//   } catch (error) {

//     if (uploadedFilePath) {
//       try {
//         await fs.unlink(uploadedFilePath);
//       } catch (unlinkError) {
//         console.error("Failed to delete uploaded file:", unlinkError);
//       }
//     }

//     handleError(res, error);
//   }
// };

export const handlePostBarang = async (req, res) => {
  const {
    kodeBarang,
    namaBarang,
    nomorRegister,
    merkType,
    ukuran,
   
    jenis,
    hargaBarang,
    kondisi,
    perolehan,
  } = req.body;

  if (
    !kodeBarang ||
    !namaBarang ||
    
    !hargaBarang ||
    !kondisi ||
    !perolehan
  ) {
    return res
      .status(400)
      .json({ message: "Semua data harus diisi , coba lagi" });
  }

  const existingBarang = await prisma.barang.findFirst({
    where: {
      namaBarang: {
        equals: namaBarang.toLowerCase(),
      },
    },
  });

  if (existingBarang) {
    return res
      .status(400)
      .json({ message: "Nama barang sudah ada. Harap gunakan nama lain." });
  }

  let newBarang;

  try {
    // Buat barang baru di database
    newBarang = await prisma.barang.create({
      data: {
        kodeBarang,
        namaBarang,
        nomorRegister,
        merkType,
        ukuran,
        jenis,
        qty: 0,
        tahun: new Date().getFullYear(),
        hargaBarang: parseInt(hargaBarang),
        kondisi,
        perolehan,
      },
    });

    // Upload foto ke Firebase Storage
    if (req.file && req.file.buffer) {
      const imageBuffer = req.file.buffer; // Pastikan req.file.buffer ada
      console.log(req.file);

      const storageRef = ref(storage, `images/${req.file.originalname}`);
      const snapshot = await uploadBytes(storageRef, imageBuffer);
      const fotoURL = await getDownloadURL(snapshot.ref);

      // Generate QR code
      const qrCodeData = `${URL_QR}/detail/${newBarang.id}`;
      const qrCodeImage = await QRCode.toBuffer(qrCodeData, {
        errorCorrectionLevel: "H",
        type: "png",
        width: 300,
      });

      // Upload QR code ke Firebase Storage
      const qrStorageRef = ref(
        storage,
        `qrcodes/${namaBarang}-${newBarang.id}.png`
      );
      const qrSnapshot = await uploadBytes(qrStorageRef, qrCodeImage);
      const qrCodeURL = await getDownloadURL(qrSnapshot.ref);

      // Update barang dengan URL dari Firebase Storage
      newBarang = await prisma.barang.update({
        where: { id: newBarang.id },
        data: { foto: fotoURL, imageBarcode: qrCodeURL },
      });
    }

    // Kembalikan respons dengan data barang yang diperbarui
    res.status(201).json(newBarang);
  } catch (error) {
    // Jika ada kesalahan pada salah satu langkah, hapus data barang yang telah dibuat
    if (newBarang) {
      await prisma.barang.delete({
        where: { id: newBarang.id },
      });
    }
    // Tangani error dengan benar
    handleError(res, error);
  }
};

export const handleEditBarang = async (req, res) => {
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
  } = req.body;

  const { id } = req.params;
  

  if (!id) {
    return res.status(400).json({ message: "id harus diisi" });
  }

  if (
    !kodeBarang ||
    !namaBarang ||
    !qty ||
    !jenis ||
    !nomorRegister ||
    !merkType ||
    !ukuran ||
    !hargaBarang ||
    !kondisi ||
    !perolehan
  ) {
    return res.status(400).json({ message: "semua field harus diisi" });
  }

  try {
    const findItem = await prisma.barang.findFirst({
      where: {
        id: id,
      },
    });
    if (!findItem) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    const existingBarang = await prisma.barang.findFirst({
      where: {
        namaBarang : {
          equals: namaBarang.toLowerCase(),
        }
      },
    });
    
    console.log(id);
    if ( existingBarang.id !== id) {
      return res.status(400).json({
        message: "Nama barang sudah ada. Harap gunakan nama lain.",
      });
    }

    console.log("test",existingBarang);

    await prisma.barang.update({
      where: { id: id },
      data: {
        kodeBarang,
        namaBarang,
        nomorRegister,
        merkType,
        ukuran,
        qty: parseInt(qty),
        jenis,
        hargaBarang: parseInt(hargaBarang),
        kondisi,
        perolehan,
      },
    });

    res.status(200).json({ message: "Barang Berhasil diupdate" });
  } catch (error) {
    handleError(res, error);
  }
};


