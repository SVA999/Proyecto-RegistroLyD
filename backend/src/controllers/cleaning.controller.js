const cleaningService = require('../services/cleaning.service');
const prisma = require('../config/database');
const { AppError } = require('../utils/errors');

class CleaningController {
  // Obtener ubicaciones
  async getLocations(req, res, next) {
    try {
      const locations = await prisma.location.findMany({
        where: { active: true },
        orderBy: [
          { building: 'asc' },
          { floor: 'asc' },
          { room: 'asc' }
        ]
      });
      
      res.json({
        status: 'success',
        data: { locations }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener tipos de limpieza
  async getCleaningTypes(req, res, next) {
    try {
      const cleaningTypes = await prisma.cleaningType.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      });
      
      res.json({
        status: 'success',
        data: { cleaningTypes }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener productos
  async getProducts(req, res, next) {
    try {
      const products = await prisma.product.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      });
      
      res.json({
        status: 'success',
        data: { products }
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear registro de limpieza
  async createRecord(req, res, next) {
    try {
      const { locationId, cleaningTypeId, productId, duration, observations } = req.body;

      // Verificar que ubicación existe
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      });
      if (!location || !location.active) {
        return next(new AppError('Ubicación no encontrada o inactiva', 400));
      }

      // Verificar que tipo de limpieza existe
      const cleaningType = await prisma.cleaningType.findUnique({
        where: { id: cleaningTypeId }
      });
      if (!cleaningType || !cleaningType.active) {
        return next(new AppError('Tipo de limpieza no encontrado o inactivo', 400));
      }

      // Verificar producto si se proporciona
      if (productId) {
        const product = await prisma.product.findUnique({
          where: { id: productId }
        });
        if (!product || !product.active) {
          return next(new AppError('Producto no encontrado o inactivo', 400));
        }
      }

      const endTime = duration ? new Date(Date.now() + duration * 60000) : new Date();

      const record = await prisma.cleaningRecord.create({
        data: {
          userId: req.user.id,
          locationId,
          cleaningTypeId,
          productId: productId || null,
          endTime,
          duration: duration || null,
          observations: observations || null
        },
        include: {
          user: {
            select: { name: true, email: true }
          },
          location: true,
          cleaningType: true,
          product: true
        }
      });

      res.status(201).json({
        status: 'success',
        message: 'Registro de limpieza creado exitosamente',
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener mis registros
  async getMyRecords(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await cleaningService.getMyRecords(
        req.user.id, 
        parseInt(page), 
        parseInt(limit)
      );

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar registro
  async updateRecord(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedRecord = await cleaningService.updateRecord(
        parseInt(id), 
        req.user.id, 
        updateData
      );

      res.json({
        status: 'success',
        message: 'Registro actualizado exitosamente',
        data: { record: updatedRecord }
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar registro
  async deleteRecord(req, res, next) {
    try {
      const { id } = req.params;
      const result = await cleaningService.deleteRecord(parseInt(id), req.user.id);

      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CleaningController();