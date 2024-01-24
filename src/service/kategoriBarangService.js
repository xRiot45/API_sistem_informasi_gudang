import { validation } from '../validation/validation.js';
import { prismaClient } from '../app/database.js';
import { ResponseError } from '../error/responseError.js';
import {
  createKategoriBarangValidation,
  getKategoriBarangValidation,
} from '../validation/kategoriBarangValidation.js';

// GET
const getKategoriBarangService = async () => {
  return prismaClient.kategoriBarang.findMany({
    select: {
      id_kategori_barang: true,
      nama_kategori_barang: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// GET BY ID
const getKategoriBarangByIdService = async (kategoriBarangId) => {
  kategoriBarangId = await validation(
    getKategoriBarangValidation,
    kategoriBarangId,
  );
  const kategoriBarang = await prismaClient.kategoriBarang.findFirst({
    where: {
      id_kategori_barang: kategoriBarangId,
    },
    select: {
      id_kategori_barang: true,
      nama_kategori_barang: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!kategoriBarang) {
    throw new ResponseError(404, 'Kategori Barang Tidak Ditemukan');
  }

  return kategoriBarang;
};

// POST
const createKategoriBarangService = async (request) => {
  const kategoriBarang = await validation(
    createKategoriBarangValidation,
    request,
  );

  const kategoriBarangExist = await prismaClient.kategoriBarang.count({
    where: {
      nama_kategori_barang: kategoriBarang.nama_kategori_barang,
    },
  });

  if (kategoriBarangExist === 1) {
    throw new ResponseError(409, 'Nama Kategori Barang Sudah Ada');
  }

  return prismaClient.kategoriBarang.create({
    data: kategoriBarang,
    select: {
      id_kategori_barang: true,
      nama_kategori_barang: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export default {
  getKategoriBarangService,
  getKategoriBarangByIdService,
  createKategoriBarangService,
};
