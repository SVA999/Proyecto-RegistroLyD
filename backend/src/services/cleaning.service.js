const prisma = require('../config/database');
const { AppError } = require('../utils/errors');

class CleaningService {
  // Verificar si puede editar el registro (6 horas)
  canEditRecord(record, userId) {
    const now = new Date();
    const createdAt = new Date(record.createdAt);
    const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    
    // Solo el creador puede editar y dentro de las 6 horas
    const isOwner = record.userId === userId;
    const withinTimeLimit = createdAt >= sixHoursAgo;
    
    return isOwner && withinTimeLimit;
  }

  async getMyRecords(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [records, total] = await Promise.all([
      prisma.cleaningRecord.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          location: true,
          cleaningType: true,
          product: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.cleaningRecord.count({ where: { userId } })
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateRecord(recordId, userId, updateData) {
    // Buscar el registro
    const record = await prisma.cleaningRecord.findUnique({
      where: { id: recordId },
      include: {
        location: true,
        cleaningType: true,
        product: true
      }
    });

    if (!record) {
      throw new AppError('Registro no encontrado', 404);
    }

    // Verificar permisos de edición
    if (!this.canEditRecord(record, userId)) {
      throw new AppError('No puede editar este registro. Solo puede editar sus registros dentro de las 6 horas posteriores a su creación.', 403);
    }

    // Validar que el producto existe si se proporciona
    if (updateData.productId) {
      const product = await prisma.product.findUnique({
        where: { id: updateData.productId }
      });
      if (!product || !product.active) {
        throw new AppError('Producto no encontrado o inactivo', 400);
      }
    }

    // Actualizar solo campos permitidos
    const allowedFields = ['productId', 'observations'];
    const filteredData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Actualizar registro
    const updatedRecord = await prisma.cleaningRecord.update({
      where: { id: recordId },
      data: {
        ...filteredData,
        updatedAt: new Date() // Agregar campo updatedAt al schema si no existe
      },
      include: {
        location: true,
        cleaningType: true,
        product: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return updatedRecord;
  }

  async deleteRecord(recordId, userId) {
    const record = await prisma.cleaningRecord.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      throw new AppError('Registro no encontrado', 404);
    }

    if (!this.canEditRecord(record, userId)) {
      throw new AppError('No puede eliminar este registro. Solo puede eliminar sus registros dentro de las 6 horas posteriores a su creación.', 403);
    }

    await prisma.cleaningRecord.delete({
      where: { id: recordId }
    });

    return { message: 'Registro eliminado exitosamente' };
  }
}

module.exports = new CleaningService();