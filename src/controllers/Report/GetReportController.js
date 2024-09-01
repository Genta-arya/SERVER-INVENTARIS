import prisma from "../../../prisma/Config.js";

export const getReportTahunan = async (req, res) => {
    const { date } = req.body;
    
    if (!date) {
        return res.status(400).json({ message: "Tahun tidak boleh kosong" });
    }

    try {
        // Ambil data inventaris berdasarkan tahun
        const findAllInventaris = await prisma.inventaris.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${date}-01-01`), // Mulai dari awal tahun
                    lt: new Date(`${Number(date) + 1}-01-01`), // Hingga akhir tahun
                },
            },
            select: {
                id: true,
                qty: true,
                createdAt: true,
                updatedAt: true,
                barang: {
                    select: {
                        id: true,
                        kodeBarang: true,
                        namaBarang: true,
                        nomorRegister: true,
                        merkType: true,
                        ukuran: true,
                        qty: true,
                        tahun: true,
                        hargaBarang: true,
                        kondisi: true,
                        jenis: true,
                        foto: true,
                        perolehan: true,
                        imageBarcode: true,
                    }
                },
                ruangan: {
                    select: {
                        id: true,
                        nama: true
                    }
                }
            }
        });

        // Kembalikan data inventaris yang sudah difilter
        res.status(200).json(findAllInventaris);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
    }
};
