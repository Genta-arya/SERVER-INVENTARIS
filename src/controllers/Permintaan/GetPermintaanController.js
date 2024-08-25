

import { handleError } from '../../utils/errorHandler.js';
import prisma from './../../../prisma/Config.js';

export const getPermintaan = async (req, res) => {
    try {
        const permintaan = await prisma.permintaan.findMany({
            include: {
                barang: true, 
                ruangan: true, 
            },
        });

        if (!permintaan) {
            return res.status(404).json({ message: "Permintaan tidak ditemukan" });
        }

        return res.status(200).json({ data: permintaan });
    } catch (error) {
        handleError(res, error);
    }
};
