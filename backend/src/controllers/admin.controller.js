const prisma = require('../config/database');
const { AppError } = require('../utils/errors');

class AdminController {
  // Obtener todos los registros con filtros
  async getAllRecords(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        building, 
        startDate, 
        endDate,
        userId,
        cleaningTypeId 
      } = req.query;
      
      const skip = (page - 1) * limit;
      const where = {};

      // Filtros
      if (building) {
        where.location = {
          building: {
            contains: building,
            mode: 'insensitive'
          }
        };
      }

      if (userId && !isNaN(parseInt(userId))) {
        where.userId = parseInt(userId);
      }

      if (cleaningTypeId && !isNaN(parseInt(cleaningTypeId))) {
        where.cleaningTypeId = parseInt(cleaningTypeId);
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          where.createdAt.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [records, total] = await Promise.all([
        prisma.cleaningRecord.findMany({
          where,
          skip,
          take: parseInt(limit),
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            location: true,
            cleaningType: true,
            product: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.cleaningRecord.count({ where })
      ]);

      res.json({
        status: 'success',
        data: {
          records,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          },
          filters: {
            building,
            startDate,
            endDate,
            userId,
            cleaningTypeId
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Estadísticas del dashboard
  async getDashboardStats(req, res, next) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        // Registros de hoy
        totalRecordsToday,
        
        // Registros de esta semana
        totalRecordsThisWeek,
        
        // Registros de este mes
        totalRecordsThisMonth,
        
        // Total de usuarios activos
        totalActiveUsers,
        
        // Total de ubicaciones activas
        totalActiveLocations,
        
        // Registros recientes (últimos 10)
        recentRecords,
        
        // Operarios más activos este mes
        topOperators,
        
        // Ubicaciones más limpiadas este mes
        topLocations,
        
        // Tipos de limpieza más usados este mes
        topCleaningTypes
      ] = await Promise.all([
        // Registros de hoy
        prisma.cleaningRecord.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        }),
        
        // Registros de esta semana
        prisma.cleaningRecord.count({
          where: {
            createdAt: {
              gte: thisWeekStart
            }
          }
        }),
        
        // Registros de este mes
        prisma.cleaningRecord.count({
          where: {
            createdAt: {
              gte: thisMonthStart
            }
          }
        }),
        
        // Usuarios activos
        prisma.user.count({
          where: { active: true }
        }),
        
        // Ubicaciones activas
        prisma.location.count({
          where: { active: true }
        }),
        
        // Registros recientes
        prisma.cleaningRecord.findMany({
          take: 10,
          include: {
            user: { select: { name: true } },
            location: true,
            cleaningType: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        
        // Top operarios del mes
        prisma.cleaningRecord.groupBy({
          by: ['userId'],
          where: {
            createdAt: {
              gte: thisMonthStart
            }
          },
          _count: {
            id: true
          },
          orderBy: {
            _count: {
              id: 'desc'
            }
          },
          take: 5
        }),
        
        // Top ubicaciones del mes
        prisma.cleaningRecord.groupBy({
          by: ['locationId'],
          where: {
            createdAt: {
              gte: thisMonthStart
            }
          },
          _count: {
            id: true
          },
          orderBy: {
            _count: {
              id: 'desc'
            }
          },
          take: 5
        }),
        
        // Top tipos de limpieza del mes
        prisma.cleaningRecord.groupBy({
          by: ['cleaningTypeId'],
          where: {
            createdAt: {
              gte: thisMonthStart
            }
          },
          _count: {
            id: true
          },
          orderBy: {
            _count: {
              id: 'desc'
            }
          },
          take: 5
        })
      ]);

      // Enriquecer datos de top operarios
      const enrichedTopOperators = await Promise.all(
        topOperators.map(async (item) => {
          const user = await prisma.user.findUnique({
            where: { id: item.userId },
            select: { name: true, email: true }
          });
          return {
            user,
            count: item._count.id
          };
        })
      );

      // Enriquecer datos de top ubicaciones
      const enrichedTopLocations = await Promise.all(
        topLocations.map(async (item) => {
          const location = await prisma.location.findUnique({
            where: { id: item.locationId }
          });
          return {
            location,
            count: item._count.id
          };
        })
      );

      // Enriquecer datos de top tipos de limpieza
      const enrichedTopCleaningTypes = await Promise.all(
        topCleaningTypes.map(async (item) => {
          const cleaningType = await prisma.cleaningType.findUnique({
            where: { id: item.cleaningTypeId }
          });
          return {
            cleaningType,
            count: item._count.id
          };
        })
      );

      res.json({
        status: 'success',
        data: {
          stats: {
            totalRecordsToday,
            totalRecordsThisWeek,
            totalRecordsThisMonth,
            totalActiveUsers,
            totalActiveLocations
          },
          recentRecords,
          analytics: {
            topOperators: enrichedTopOperators,
            topLocations: enrichedTopLocations,
            topCleaningTypes: enrichedTopCleaningTypes
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, role, active } = req.query;
      const skip = (page - 1) * limit;
      const where = {};

      if (role && ['OPERATOR', 'ADMIN'].includes(role)) {
        where.role = role;
      }

      if (active !== undefined) {
        where.active = active === 'true';
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit),
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            active: true,
            createdAt: true,
            _count: {
              select: {
                cleaningRecords: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        status: 'success',
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Activar/desactivar usuario
  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (typeof active !== 'boolean') {
        return next(new AppError('El estado activo debe ser true o false', 400));
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: { id: true, name: true, role: true }
      });

      if (!user) {
        return next(new AppError('Usuario no encontrado', 404));
      }

      // No permitir desactivar el último admin
      if (!active && user.role === 'ADMIN') {
        const activeAdmins = await prisma.user.count({
          where: { role: 'ADMIN', active: true }
        });
        
        if (activeAdmins <= 1) {
          return next(new AppError('No se puede desactivar el último administrador', 400));
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { active },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true
        }
      });

      res.json({
        status: 'success',
        message: `Usuario ${active ? 'activado' : 'desactivado'} exitosamente`,
        data: { user: updatedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  // Exportar registros (datos básicos para CSV)
  async exportRecords(req, res, next) {
    try {
      const { startDate, endDate, building, userId, cleaningTypeId } = req.query;
      const where = {};

      // Filtros para exportación
      if (building) {
        where.location = {
          building: {
            contains: building,
            mode: 'insensitive'
          }
        };
      }

      if (userId && !isNaN(parseInt(userId))) {
        where.userId = parseInt(userId);
      }

      if (cleaningTypeId && !isNaN(parseInt(cleaningTypeId))) {
        where.cleaningTypeId = parseInt(cleaningTypeId);
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          where.createdAt.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const records = await prisma.cleaningRecord.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true }
          },
          location: true,
          cleaningType: true,
          product: true
        },
        orderBy: { createdAt: 'desc' }
      });

      // Formatear datos para export
      const exportData = records.map(record => ({
        id: record.id,
        fecha: record.createdAt.toLocaleDateString('es-CO'),
        hora: record.createdAt.toLocaleTimeString('es-CO'),
        operario: record.user.name,
        email_operario: record.user.email,
        edificio: record.location.building,
        piso: record.location.floor || 'N/A',
        ubicacion: record.location.room,
        tipo_ubicacion: record.location.type,
        tipo_limpieza: record.cleaningType.name,
        producto: record.product?.name || 'No especificado',
        duracion_minutos: record.duration || 0,
        observaciones: record.observations || ''
      }));

      res.json({
        status: 'success',
        data: {
          records: exportData,
          total: exportData.length,
          exportDate: new Date().toISOString(),
          filters: { startDate, endDate, building, userId, cleaningTypeId }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();