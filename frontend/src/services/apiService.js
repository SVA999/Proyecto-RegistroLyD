import axios from 'axios';

// Configuración base de axios
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
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
      console.log('🔄 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
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
    
    // Extraer data del formato estándar del backend
    return response.data.data || response.data;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Manejar errores específicos
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          console.warn('🔒 Token expirado, redirigiendo a login...');
          localStorage.removeItem('token');
          // Dispatch custom event para que AuthContext maneje el logout
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;
        case 403:
          console.warn('🚫 Acceso denegado');
          break;
        case 404:
          console.warn('🔍 Recurso no encontrado');
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
      
      // Crear error estructurado
      const errorMessage = data?.message || `Error ${status}`;
      error.message = errorMessage;
    } else if (error.request) {
      // Error de red
      console.error('🌐 Error de conexión:', error.request);
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
    const response = await apiClient.post('/auth/login', credentials);
    return response;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response;
  },
};

// Servicios de Limpieza
const cleaningService = {
  // Datos maestros
  getLocations: async () => {
    const response = await apiClient.get('/cleaning/locations');
    return response;
  },

  getCleaningTypes: async () => {
    const response = await apiClient.get('/cleaning/cleaning-types');
    return response;
  },

  getProducts: async () => {
    const response = await apiClient.get('/cleaning/products');
    return response;
  },

  // Registros personales
  getMyRecords: async (params = {}) => {
    const { page = 1, limit = 20 } = params;
    const response = await apiClient.get(`/cleaning/my-records?page=${page}&limit=${limit}`);
    return response;
  },

  // CRUD de registros
  createRecord: async (recordData) => {
    const response = await apiClient.post('/cleaning/records', recordData);
    return response;
  },

  updateRecord: async (recordId, updateData) => {
    const response = await apiClient.put(`/cleaning/records/${recordId}`, updateData);
    return response;
  },

  deleteRecord: async (recordId) => {
    const response = await apiClient.delete(`/cleaning/records/${recordId}`);
    return response;
  },
};

// Servicios de Administración
const adminService = {
  // Gestión de registros
  getAllRecords: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/admin/records?${queryString}`);
    return response;
  },

  exportRecords: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/admin/records/export?${queryString}`);
    return response;
  },

  // Estadísticas y dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response;
  },

  // Gestión de usuarios
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/admin/users?${queryString}`);
    return response;
  },

  toggleUserStatus: async (userId, active) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`, { active });
    return response;
  },
};

// Utilidades de la API
const apiUtils = {
  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.data;
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
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
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
};

export default apiService;