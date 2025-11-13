import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  People as PeopleIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  CleaningServices as CleaningIcon,
  Person as PersonIcon,
  BarChart as BarChartIcon,
  Block as BlockIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Importar contexto de autenticación
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

// Componente principal del Dashboard Administrador
const DashboardAdmin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Context de autenticación
  const { user, logout } = useAuth();
  
  // Estados principales
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para datos
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Estados para paginación
  const [recordsPage, setRecordsPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [usersPerPage, setUsersPerPage] = useState(10);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    building: '',
    startDate: null,
    endDate: null,
    userId: '',
    cleaningTypeId: '',
    role: '',
    active: '',
  });
  
  // Estados para datos maestros
  const [cleaningTypes, setCleaningTypes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  // Estados para modales
  const [filtersOpen, setFiltersOpen] = useState(false);


  // Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [cleaningTypesRes, usersRes] = await Promise.all([
        apiService.cleaning.getCleaningTypes(),
        apiService.admin.getAllUsers({ limit: 1000 }),
      ]);
      
      setCleaningTypes(Array.isArray(cleaningTypesRes) ? cleaningTypesRes : (cleaningTypesRes?.cleaningTypes || []));
      setAllUsers(Array.isArray(usersRes) ? usersRes : (usersRes?.users || []));
      
      // Cargar datos del tab activo
      if (activeTab === 0) {
        loadStats();
      } else if (activeTab === 1) {
        loadRecords();
      } else if (activeTab === 2) {
        loadUsers();
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error cargando datos del sistema');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await apiService.admin.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setError('Error cargando estadísticas');
    }
  }, []);

  // Función para cargar registros
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: recordsPage + 1,
        limit: recordsPerPage,
        ...filters,
        startDate: filters.startDate ? filters.startDate.format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? filters.endDate.format('YYYY-MM-DD') : undefined,
      };
      
      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await apiService.admin.getAllRecords(params);
      setRecords(response.records || []);
      setTotalRecords(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error cargando registros:', error);
      setError('Error cargando registros');
    } finally {
      setLoading(false);
    }
  }, [recordsPage, recordsPerPage, filters]);

  // Función para cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: usersPage + 1,
        limit: usersPerPage,
        role: filters.role || undefined,
        active: filters.active || undefined,
      };
      
      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await apiService.admin.getAllUsers(params);
      setUsers(response.users || []);
      setTotalUsers(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  }, [usersPage, usersPerPage, filters.role, filters.active]);

// Cargar datos iniciales
useEffect(() => {
  loadInitialData();
}, [loadInitialData]);

// Cargar datos cuando cambien los filtros
useEffect(() => {
  if (activeTab === 0) {
    loadStats();
  } else if (activeTab === 1) {
    loadRecords();
  } else if (activeTab === 2) {
    loadUsers();
  }
}, [activeTab, loadStats, loadRecords, loadUsers]);


  // Función para exportar registros
  const handleExportRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        startDate: filters.startDate ? filters.startDate.format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? filters.endDate.format('YYYY-MM-DD') : undefined,
      };
      
      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Exportando con parámetros:', params);
      
      // Usar el endpoint de exportación que devuelve datos estructurados
      const response = await apiService.admin.exportRecords(params);
      console.log('Respuesta de exportación:', response);
      
      // El interceptor de axios ya extrae response.data.data, así que response ya es el objeto data
      // El backend devuelve { records: [...], total: X, ... }
      const records = response?.records || (Array.isArray(response) ? response : []);
      
      if (!records || records.length === 0) {
        setError('No hay datos para exportar con los filtros aplicados');
        return;
      }
      
      // Generar contenido CSV para enviar a Google Sheets
      const csvContent = convertToCSV(records);
      const filename = `registros_limpieza_${dayjs().format('YYYY-MM-DD')}.csv`;
      
      // Enviar datos a Google Sheets a través del webhook de n8n
      const n8nWebhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL;
      if (!n8nWebhookUrl) {
        setError('Error: URL del webhook de n8n no configurada. Configure REACT_APP_N8N_WEBHOOK_URL en las variables de entorno.');
        return;
      }
      
      try {
        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accion: 'exportar',
            timestamp: new Date().toISOString(),
            registros: records.length,
            filtros: params,
            filename: filename,
            usuario: user?.name || user?.email || 'Admin',
            fechaExportacion: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            // Enviar datos completos para Google Sheets
            datos: records, // Datos en formato JSON
            csv: csvContent, // Datos en formato CSV
            headers: records.length > 0 ? Object.keys(records[0]) : []
          })
        });
        
        if (!webhookResponse.ok) {
          throw new Error(`Error del servidor: ${webhookResponse.status}`);
        }
        
        console.log('Datos enviados a Google Sheets exitosamente');
        setSuccess(`Datos exportados a Google Sheets exitosamente (${records.length} registros)`);
      } catch (webhookError) {
        console.error('Error al enviar datos a Google Sheets:', webhookError);
        setError('Error al enviar datos a Google Sheets: ' + (webhookError.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error exportando registros:', error);
      setError('Error exportando datos: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  // Función para convertir datos a CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    // Si los datos vienen del backend de exportación, ya están formateados
    if (data[0] && typeof data[0] === 'object' && data[0].id) {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
              ? `"${stringValue.replace(/"/g, '""')}"` 
              : stringValue;
          }).join(',')
        )
      ].join('\n');
      
      return csvContent;
    }
    
    // Si los datos vienen de la tabla normal, formatearlos
    const csvData = data.map(record => ({
      id: record.id,
      fecha: dayjs(record.createdAt).format('DD/MM/YYYY'),
      hora: dayjs(record.createdAt).format('HH:mm'),
      operario: record.user?.name || 'N/A',
      email_operario: record.user?.email || 'N/A',
      edificio: record.location?.building || 'N/A',
      piso: record.location?.floor || 'N/A',
      ubicacion: record.location?.room || 'N/A',
      tipo_ubicacion: record.location?.type || 'N/A',
      tipo_limpieza: record.cleaningType?.name || 'N/A',
      producto: record.product?.name || 'No especificado',
      duracion_minutos: record.duration || 0,
      observaciones: record.observations || ''
    }));
    
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header];
          const stringValue = String(value);
          return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  // Función para descargar CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para cambiar estado de usuario
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);
      await apiService.admin.toggleUserStatus(userId, !currentStatus);
      setSuccess(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      loadUsers(); // Recargar lista de usuarios
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);
      setError(error.message || 'Error cambiando estado de usuario');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambio de página de registros
  const handleChangeRecordsPage = (event, newPage) => {
    setRecordsPage(newPage);
  };

  const handleChangeRecordsPerPage = (event) => {
    setRecordsPerPage(parseInt(event.target.value, 10));
    setRecordsPage(0);
  };

  // Función para manejar cambio de página de usuarios
  const handleChangeUsersPage = (event, newPage) => {
    setUsersPage(newPage);
  };

  const handleChangeUsersPerPage = (event) => {
    setUsersPerPage(parseInt(event.target.value, 10));
    setUsersPage(0);
  };

  // Función para manejar filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    // Resetear páginas cuando cambien los filtros
    setRecordsPage(0);
    setUsersPage(0);
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      building: '',
      startDate: null,
      endDate: null,
      userId: '',
      cleaningTypeId: '',
      role: '',
      active: '',
    });
    setRecordsPage(0);
    setUsersPage(0);
  };

  // Función para cerrar notificaciones
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setError(null);
    setSuccess(null);
  };

  // Componente de estadísticas del dashboard
  const DashboardStats = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Control - Administrador
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Resumen general del sistema de limpieza y desinfección
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : stats ? (
        <Grid container spacing={3}>
          {/* Estadísticas principales */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <CleaningIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {stats.stats?.totalRecordsToday || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Registros Hoy
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="secondary.main">
                      {stats.stats?.totalRecordsThisWeek || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Esta Semana
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <BarChartIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {stats.stats?.totalRecordsThisMonth || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Este Mes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="info.main">
                      {stats.stats?.totalActiveUsers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios Activos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="warning.main">
                      {stats.stats?.totalActiveLocations || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ubicaciones
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Registros recientes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Registros Recientes
                </Typography>
                {stats.recentRecords && stats.recentRecords.length > 0 ? (
                  <List dense>
                    {stats.recentRecords.slice(0, 5).map((record) => (
                      <ListItem key={record.id} divider>
                        <ListItemIcon>
                          <CleaningIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${record.user?.name || 'Usuario'} - ${record.location?.building || 'Ubicación'}`}
                          secondary={`${record.cleaningType?.name || 'Tipo'} - ${dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay registros recientes
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Top Operarios */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Operarios Más Activos (Este Mes)
                </Typography>
                {stats.analytics?.topOperators && stats.analytics.topOperators.length > 0 ? (
                  <List dense>
                    {stats.analytics.topOperators.map((item, index) => (
                      <ListItem key={item.user?.id || index} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.user?.name || 'Usuario'}
                          secondary={`${item.count} registros`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay datos disponibles
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="error">
          Error cargando estadísticas
        </Alert>
      )}
    </Box>
  );

  // Componente de lista de registros
  const RecordsList = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Registros de Limpieza</Typography>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setFiltersOpen(true)}
            variant="outlined"
          >
            Filtros
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportRecords}
            variant="contained"
            disabled={loading}
          >
            Enviar a Google Sheets
          </Button>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadRecords}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Operario</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {record.user?.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.user?.email || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {record.location?.building || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.location?.floor || 'N/A'} - {record.location?.room || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.cleaningType?.name || 'N/A'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    {record.product?.name || 'No especificado'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {record.observations || 'Sin observaciones'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalRecords}
            rowsPerPage={recordsPerPage}
            page={recordsPage}
            onPageChange={handleChangeRecordsPage}
            onRowsPerPageChange={handleChangeRecordsPerPage}
            labelRowsPerPage="Registros por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      )}
    </Box>
  );

  // Componente de gestión de usuarios
  const UsersManagement = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Gestión de Usuarios</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadUsers}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Registros</TableCell>
                <TableCell>Fecha Registro</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      color={user.role === 'ADMIN' ? 'error' : 'primary'} 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.active ? 'Activo' : 'Inactivo'} 
                      size="small" 
                      color={user.active ? 'success' : 'default'} 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user._count?.cleaningRecords || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {dayjs(user.createdAt).format('DD/MM/YYYY')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title={user.active ? 'Desactivar' : 'Activar'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleUserStatus(user.id, user.active)}
                          disabled={loading}
                          color={user.active ? 'error' : 'success'}
                        >
                          {user.active ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalUsers}
            rowsPerPage={usersPerPage}
            page={usersPage}
            onPageChange={handleChangeUsersPage}
            onRowsPerPageChange={handleChangeUsersPerPage}
            labelRowsPerPage="Usuarios por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      )}
    </Box>
  );

  // Componente de filtros
  const FiltersDialog = () => (
    <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Filtros de Búsqueda</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Edificio"
              value={filters.building}
              onChange={(e) => handleFilterChange('building', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Operario</InputLabel>
              <Select
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                label="Operario"
              >
                <MenuItem value="">Todos</MenuItem>
                {allUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Limpieza</InputLabel>
              <Select
                value={filters.cleaningTypeId}
                onChange={(e) => handleFilterChange('cleaningTypeId', e.target.value)}
                label="Tipo de Limpieza"
              >
                <MenuItem value="">Todos</MenuItem>
                {cleaningTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                label="Rol"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="OPERATOR">Operario</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Fecha Inicio"
              value={filters.startDate}
              onChange={(newValue) => handleFilterChange('startDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Fecha Fin"
              value={filters.endDate}
              onChange={(newValue) => handleFilterChange('endDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearFilters}>
          Limpiar Filtros
        </Button>
        <Button onClick={() => setFiltersOpen(false)}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard Administrador - UPB
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 0}
                  onClick={() => {
                    setActiveTab(0);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 1}
                  onClick={() => {
                    setActiveTab(1);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Registros" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 2}
                  onClick={() => {
                    setActiveTab(2);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
              </ListItem>
            </List>
            
            <Divider />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={user?.name || 'Administrador'}
                  secondary={user?.email}
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 280px)` },
            ml: { sm: '280px' },
            mt: '64px',
          }}
        >
          <Container maxWidth="xl">
            {activeTab === 0 && <DashboardStats />}
            {activeTab === 1 && <RecordsList />}
            {activeTab === 2 && <UsersManagement />}
          </Container>
        </Box>

        {/* Filtros */}
        <FiltersDialog />

        {/* Notificaciones */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default DashboardAdmin;
