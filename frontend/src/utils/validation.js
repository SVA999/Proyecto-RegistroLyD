// utils/validation.js

// Expresiones regulares comunes
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  phone: /^[+]?[0-9]{10,15}$/,
};

// Mensajes de error estándar
const ERROR_MESSAGES = {
  required: (field) => `${field} es requerido`,
  email: 'Ingrese un correo electrónico válido',
  password: 'La contraseña debe tener al menos 6 caracteres, incluir letras y números',
  passwordSimple: 'La contraseña debe tener al menos 6 caracteres',
  passwordMatch: 'Las contraseñas no coinciden',
  name: 'El nombre debe tener entre 2 y 50 caracteres, solo letras y espacios',
  phone: 'Ingrese un número de teléfono válido',
  minLength: (field, length) => `${field} debe tener al menos ${length} caracteres`,
  maxLength: (field, length) => `${field} no puede tener más de ${length} caracteres`,
};

// Validadores individuales
const validators = {
  // Validar si un campo está vacío
  required: (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return ERROR_MESSAGES.required(fieldName);
    }
    return null;
  },

  // Validar email
  email: (value) => {
    if (!value) return null; // Si está vacío, lo maneja el required
    if (!REGEX.email.test(value.trim())) {
      return ERROR_MESSAGES.email;
    }
    return null;
  },

  // Validar contraseña (versión compleja)
  password: (value) => {
    if (!value) return null;
    if (!REGEX.password.test(value)) {
      return ERROR_MESSAGES.password;
    }
    return null;
  },

  // Validar contraseña (versión simple - solo longitud)
  passwordSimple: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return ERROR_MESSAGES.passwordSimple;
    }
    return null;
  },

  // Validar coincidencia de contraseñas
  passwordMatch: (password, confirmPassword) => {
    if (!password || !confirmPassword) return null;
    if (password !== confirmPassword) {
      return ERROR_MESSAGES.passwordMatch;
    }
    return null;
  },

  // Validar nombre
  name: (value) => {
    if (!value) return null;
    if (!REGEX.name.test(value.trim())) {
      return ERROR_MESSAGES.name;
    }
    return null;
  },

  // Validar longitud mínima
  minLength: (value, length, fieldName) => {
    if (!value) return null;
    if (value.toString().length < length) {
      return ERROR_MESSAGES.minLength(fieldName, length);
    }
    return null;
  },

  // Validar longitud máxima
  maxLength: (value, length, fieldName) => {
    if (!value) return null;
    if (value.toString().length > length) {
      return ERROR_MESSAGES.maxLength(fieldName, length);
    }
    return null;
  },

  // Validar teléfono
  phone: (value) => {
    if (!value) return null;
    if (!REGEX.phone.test(value.replace(/\s+/g, ''))) {
      return ERROR_MESSAGES.phone;
    }
    return null;
  },
};

// Función principal para validar formularios
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    fieldRules.forEach(rule => {
      // Si ya hay un error para este campo, no seguir validando
      if (errors[field]) return;
      
      let error = null;
      
      if (typeof rule === 'function') {
        // Regla personalizada
        error = rule(data[field], data);
      } else if (typeof rule === 'object') {
        // Regla con parámetros
        const { validator, params = [], message } = rule;
        error = validators[validator] 
          ? validators[validator](data[field], ...params)
          : null;
        
        // Usar mensaje personalizado si se proporciona
        if (error && message) {
          error = message;
        }
      } else if (typeof rule === 'string') {
        // Regla simple por nombre
        error = validators[rule] ? validators[rule](data[field]) : null;
      }
      
      if (error) {
        errors[field] = error;
      }
    });
  });
  
  return errors;
};

// Reglas predefinidas para formularios comunes
export const FORM_RULES = {
  // Reglas para login
  login: {
    email: ['required', 'email'],
    password: [(value) => validators.required(value, 'Contraseña')],
  },

  // Reglas para registro
  register: {
    name: [
      (value) => validators.required(value, 'Nombre'),
      'name'
    ],
    email: ['required', 'email'],
    password: [
      (value) => validators.required(value, 'Contraseña'),
      'passwordSimple'
    ],
    confirmPassword: [
      (value) => validators.required(value, 'Confirmación de contraseña'),
      (value, data) => validators.passwordMatch(data.password, value)
    ],
  },

  // Reglas para registro de limpieza
  cleaningRecord: {
    locationId: [(value) => validators.required(value, 'Ubicación')],
    cleaningTypeId: [(value) => validators.required(value, 'Tipo de limpieza')],
    products: [(value) => {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return 'Debe seleccionar al menos un producto';
      }
      return null;
    }],
    observations: [
      {
        validator: 'maxLength',
        params: [500, 'Observaciones'],
      }
    ],
  },
};

// Función helper para validar un solo campo
export const validateField = (fieldName, value, rules, allData = {}) => {
  const tempData = { ...allData, [fieldName]: value };
  const tempRules = { [fieldName]: rules };
  const errors = validateForm(tempData, tempRules);
  return errors[fieldName] || null;
};

// Función para limpiar y formatear datos
export const sanitizeFormData = (data) => {
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (typeof value === 'string') {
      // Limpiar strings
      sanitized[key] = value.trim();
    } else if (Array.isArray(value)) {
      // Filtrar arrays
      sanitized[key] = value.filter(item => item !== null && item !== undefined);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

// Funciones de ayuda para UX
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

export const isFieldValid = (errors, fieldName) => {
  return !errors[fieldName];
};

// Exportar todo junto
export default {
  validators,
  validateForm,
  validateField,
  FORM_RULES,
  ERROR_MESSAGES,
  REGEX,
  sanitizeFormData,
  getFieldError,
  hasErrors,
  isFieldValid,
};