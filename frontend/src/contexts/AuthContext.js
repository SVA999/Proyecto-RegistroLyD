import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/apiService';

// Estados posibles para la autenticación
const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  status: AUTH_STATES.IDLE,
  error: null
};

// Reducer para manejo de estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        status: AUTH_STATES.LOADING,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: AUTH_STATES.AUTHENTICATED,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        status: AUTH_STATES.UNAUTHENTICATED,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        status: AUTH_STATES.UNAUTHENTICATED,
        error: null
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        status: AUTH_STATES.AUTHENTICATED,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const AuthContext = createContext();

// Provider del contexto de autenticación
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para login
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });
      
      const response = await apiService.auth.login({ email, password });
      
      // Verificar estructura de respuesta del backend
      const { user, token } = response;
      
      if (token && user) {
        // Guardar token en localStorage
        localStorage.setItem('token', token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        });

        return { success: true, user };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Función para register
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });
      
      const response = await apiService.auth.register(userData);
      
      // El registro exitoso no autentica automáticamente
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error('Error en register:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al registrar usuario';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Función para logout
  const logout = async () => {
    try {
      // Intentar logout en el servidor (sin bloquear el proceso)
      await apiService.auth.logout();
    } catch (error) {
      console.error('Error en logout del servidor:', error);
      // Continuar con logout local aunque falle el servidor
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Función para verificar usuario actual
  const getCurrentUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });
      
      const response = await apiService.auth.me();
      const user = response.user || response;
      
      if (user) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: user
        });
        return user;
      } else {
        throw new Error('Usuario no válido');
      }
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return null;
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Escuchar el evento personalizado de logout
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    } else {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  const value = {
    // Estado
    user: state.user,
    token: state.token,
    status: state.status,
    error: state.error,
    
    // Estados derivados
    isAuthenticated: state.status === AUTH_STATES.AUTHENTICATED,
    isLoading: state.status === AUTH_STATES.LOADING,
    
    // Funciones
    login,
    register,
    logout,
    getCurrentUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;