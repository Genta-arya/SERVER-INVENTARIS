import prisma from "../../../prisma/Config.js";
import fs from 'fs';
import path from 'path';

export const DeleteBarang = async (req, res) => {
    const { id } = req.params; // Mengambil ID dari URL params atau request body

    try {
        // 1. Temukan barang untuk mendapatkan URL gambar
        const barang = await prisma.barang.findUnique({
            where: { id: id },
            select: { foto: true, imageBarcode: true }
        });

        if (!barang) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        // 2. Hapus barang dari database
        await prisma.barang.delete({
            where: { id: id }
        });

        // 3. Hapus gambar dari server lokal
        // Jika gambar disimpan di server lokal
        if (barang.foto) {
            const fotoPath = path.resolve("public", "image", path.basename(barang.foto));
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

        if (barang.imageBarcode) {
            const barcodePath = path.resolve("public", "image", path.basename(barang.imageBarcode));
            if (fs.existsSync(barcodePath)) {
                fs.unlinkSync(barcodePath);
            }
        }

        // Jika menggunakan penyimpanan cloud, gunakan SDK untuk menghapus gambar

        res.status(200).json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting barang:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus barang' });
    }
}
