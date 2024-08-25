import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";

export const PostReturBarang = async (req, res) => {
    const { barangId } = req.body; // Menggunakan barangId alih-alih inventarisId

    console.log(barangId);

    if (!barangId) {
        return res.status(400).json({ message: "Barang ID diperlukan" });
    }

    try {
        // Cari inventaris berdasarkan barangId
        const inventarisList = await prisma.inventaris.findMany({
            where: { barangId: barangId },
            include: {
                barang: true,  
            },
        });

        if (inventarisList.length === 0) {
            return res.status(404).json({ message: "Inventaris tidak ditemukan" });
        }

        // Mengambil inventaris pertama dari list
        const inventaris = inventarisList[0];

        // Update stok barang di master
        const updatedBarang = await prisma.barang.update({
            where: { id: inventaris.barangId },
            data: {
                qty: inventaris.barang.qty + inventaris.qty, // Tambah qty ke stok barang
            },
        });

        // Hapus data dari tabel BarangKeluar berdasarkan barangId
        await prisma.barangKeluar.deleteMany({
            where: { barangId: inventaris.barangId },
        });

        // Hapus data permintaan terkait
        await prisma.permintaan.deleteMany({
            where: { barangId: inventaris.barangId },
        });

        // Hapus semua inventaris terkait barangId
        await prisma.inventaris.deleteMany({
            where: { barangId: barangId },
        });

        return res.status(200).json({
            message: "Barang berhasil di-retur",
            updatedBarang,
        });
    } catch (error) {
        handleError(res, error);
    }
};
