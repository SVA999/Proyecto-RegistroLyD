import axios from 'axios';

// Configuración base de axios
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? '[TOKEN PRESENTE]' : 'Sin token'
        },
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo de errores global
apiClient.interceptors.response.use(
  (response) => {
    // Log para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    // El backend devuelve data encapsulada en { success, data, message }
    // Si existe response.data.data, lo extraemos, sino devolvemos response.data
    if (response.data && typeof response.data === 'object') {
      return response.data.data || response.data;
    }
    
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Manejar errores específicos
    if (error.response) {
      const { status, data } = error.response;
      
      // Log del error detallado
      console.error(`📡 HTTP ${status} Error:`, {
        url: error.config?.url,
        method: error.config?.method,
        data: data,
        message: data?.message
      });
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          console.warn('🔒 Token expirado o inválido');
          localStorage.removeItem('token');
          // Dispatch custom event para que AuthContext maneje el logout
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;
        case 403:
          console.warn('🚫 Acceso denegado - permisos insuficientes');
          break;
        case 404:
          console.warn('🔍 Recurso no encontrado');
          break;
        case 409:
          console.warn('⚠️ Conflicto - posiblemente datos duplicados');
          break;
        case 422:
          console.warn('📝 Error de validación en los datos');
          break;
        case 429:
          console.warn('⏳ Demasiadas peticiones, intente más tarde');
          break;
        case 500:
          console.error('🛠️ Error interno del servidor');
          break;
        default:
          console.error(`🚨 Error ${status}:`, data?.message);
      }
      
      // Preservar el error original para manejo específico
      error.message = data?.message || `Error HTTP ${status}`;
    } else if (error.request) {
      // Error de red o timeout
      console.error('🌐 Error de conexión:', {
        message: error.message,
        timeout: error.code === 'ECONNABORTED',
        code: error.code
      });
      error.message = 'Error de conexión. Verifique su conexión a internet.';
    } else {
      // Error en configuración
      console.error('⚙️ Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      throw error;
    }
  },

  me: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de Limpieza
const cleaningService = {
  // Datos maestros
  getLocations: async () => {
    try {
      const response = await apiClient.get('/cleaning/locations');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCleaningTypes: async () => {
    try {
      const response = await apiClient.get('/cleaning/cleaning-types');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await apiClient.get('/cleaning/products');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Registros personales
  getMyRecords: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await apiClient.get(`/cleaning/my-records?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // CRUD de registros
  createRecord: async (recordData) => {
    try {
      const response = await apiClient.post('/cleaning/records', recordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRecord: async (recordId, updateData) => {
    try {
      const response = await apiClient.put(`/cleaning/records/${recordId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteRecord: async (recordId) => {
    try {
      const response = await apiClient.delete(`/cleaning/records/${recordId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de Administración
const adminService = {
  // Gestión de registros
  getAllRecords: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await apiClient.get(`/admin/records?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportRecords: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await apiClient.get(`/admin/records/export?${queryParams.toString()}`, {
        responseType: 'blob' // Para descargas de archivos
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Estadísticas y dashboard
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de usuarios
  getAllUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await apiClient.get(`/admin/users?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  toggleUserStatus: async (userId, active) => {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, { active });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Utilidades de la API
const apiUtils = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar conexión
  isServerOnline: async () => {
    try {
      await apiUtils.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Manejo de archivos (para futuras funcionalidades)
  uploadFile: async (file, endpoint) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos para uploads
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Descargar archivo
  downloadFile: async (url, filename) => {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });
      
      // Crear URL para descarga
      const downloadUrl = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// Servicio principal exportado
const apiService = {
  auth: authService,
  cleaning: cleaningService,
  admin: adminService,
  utils: apiUtils,
  
  // Acceso directo al cliente para casos especiales
  client: apiClient,
  
  // Configuración
  config: {
    baseURL: BASE_URL,
    timeout: apiClient.defaults.timeout,
  },
};

export default apiService;