const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../utils/errors');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError(`Errores de validación: ${errorMessages.map(e => e.message).join(', ')}`, 400));
  }
  next();
};

// Validaciones para autenticación
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email válido es requerido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

const validateRegister = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nombre solo puede contener letras y espacios'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email válido es requerido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número'),
  body('role')
    .optional()
    .isIn(['OPERATOR', 'ADMIN'])
    .withMessage('Rol debe ser OPERATOR o ADMIN'),
  handleValidationErrors
];

// Validaciones para registros de limpieza
const validateCleaningRecord = [
  body('locationId')
    .isInt({ min: 1 })
    .withMessage('ID de ubicación válido es requerido'),
  body('cleaningTypeId')
    .isInt({ min: 1 })
    .withMessage('ID de tipo de limpieza válido es requerido'),
  body('productId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de producto debe ser un número válido'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duración debe estar entre 1 y 480 minutos (8 horas)'),
  body('observations')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observaciones no pueden exceder 500 caracteres')
    .trim(),
  handleValidationErrors
];

const validateUpdateRecord = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de registro válido es requerido'),
  body('productId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de producto debe ser un número válido'),
  body('observations')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observaciones no pueden exceder 500 caracteres')
    .trim(),
  handleValidationErrors
];

// Validaciones para consultas de admin
const validateAdminRecords = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  query('building')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Edificio debe tener entre 1 y 50 caracteres'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio debe ser válida (YYYY-MM-DD)'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin debe ser válida (YYYY-MM-DD)'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateCleaningRecord,
  validateUpdateRecord,
  validateAdminRecords,
  handleValidationErrors
};
