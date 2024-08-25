import prisma from "../../../prisma/Config.js";
import { handleError } from "../../utils/errorHandler.js";

export const DeleteRuangan = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Ambil semua barang yang terkait dengan ruangan ini
        const barangList = await prisma.barang.findMany({
            where: { inventaris: { some: { ruanganId: parseInt(id) } } },
            select: { id: true } // Ambil ID barang
        });

        console.log('Barang yang terkait dengan ruangan:', barangList);

        // 2. Kembalikan qty barang yang dihapus dari inventaris ke stok barang
        for (const barang of barangList) {
            // Ambil total qty dari inventaris yang terkait
            const totalQtyInventaris = await prisma.inventaris.aggregate({
                _sum: {
                    qty: true
                },
                where: {
                    barangId: barang.id,
                    ruanganId: parseInt(id)
                }
            });

            console.log('Total qty dari inventaris untuk barang ID', barang.id, ':', totalQtyInventaris);

            const qtyToReturn = totalQtyInventaris._sum.qty || 0;

            console.log(`Qty yang dikembalikan untuk barang ID ${barang.id}:`, qtyToReturn);

            // Update stok barang dengan menambahkan qty yang dihapus
            await prisma.barang.update({
                where: { id: barang.id },
                data: {
                    qty: {
                        increment: qtyToReturn
                    }
                }
            });
        }

        // 3. Hapus permintaan yang terkait dengan ruangan ini
        const deletedPermintaan = await prisma.permintaan.deleteMany({
            where: { ruanganId: parseInt(id) },
        });

        console.log('Permintaan yang dihapus:', deletedPermintaan);

        // 4. Hapus inventaris yang terkait dengan ruangan ini
        const deletedInventaris = await prisma.inventaris.deleteMany({
            where: { ruanganId: parseInt(id) },
        });

        console.log('Inventaris yang dihapus:', deletedInventaris);

        // 5. Hapus barang yang terkait dengan ruangan ini
        const deletedBarang = await prisma.barang.deleteMany({
            where: { inventaris: { some: { ruanganId: parseInt(id) } } },
        });

        console.log('Barang yang dihapus:', deletedBarang);

        // 6. Hapus ruangan
        const deleteRuangan = await prisma.ruangan.delete({
            where: { id: parseInt(id) },
        });

        console.log('Ruangan yang dihapus:', deleteRuangan);

        res.status(200).json({ data: deleteRuangan });
    } catch (error) {
        console.error('Error deleting ruangan:', error); // Log error ke konsol
        handleError(res, error);
    }
};
