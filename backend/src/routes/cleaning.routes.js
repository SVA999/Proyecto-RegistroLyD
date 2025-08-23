const express = require('express');
const cleaningController = require('../controllers/cleaning.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { 
  validateCleaningRecord, 
  validateUpdateRecord,
  handleValidationErrors 
} = require('../middleware/validation.middleware');
const { createRecordLimiter } = require('../middleware/rateLimiter');
const { param } = require('express-validator');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de datos maestros
router.get('/locations', cleaningController.getLocations);
router.get('/cleaning-types', cleaningController.getCleaningTypes);
router.get('/products', cleaningController.getProducts);

// Rutas de registros personales
router.get('/my-records', cleaningController.getMyRecords);

// Crear registro de limpieza
router.post('/records', 
  createRecordLimiter, 
  validateCleaningRecord, 
  cleaningController.createRecord
);

// Crear registro de limpieza
router.post('/records', 
  createRecordLimiter, 
  validateCleaningRecord, 
  cleaningController.createRecord
);

// Actualizar registro (solo campos permitidos, solo dentro de 6 horas)
router.put('/records/:id', 
  validateUpdateRecord, 
  cleaningController.updateRecord
);

// Eliminar registro (solo dentro de 6 horas)
router.delete('/records/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID de registro válido es requerido'),
  handleValidationErrors
], cleaningController.deleteRecord);

module.exports = router;