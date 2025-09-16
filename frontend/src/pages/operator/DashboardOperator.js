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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  CleaningServices as CleaningIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ProductIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Importar contexto de autenticación
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

// Componente principal del Dashboard Operario
const DashboardOperator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Context de autenticación
  const { user, logout } = useAuth();
  
  // Estados principales
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para datos maestros
  const [locations, setLocations] = useState([]);
  const [cleaningTypes, setCleaningTypes] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Estados para registros
  const [myRecords, setMyRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Estados para formulario de registro
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    locationId: '',
    cleaningTypeId: '',
    products: [],
    observations: '',
    duration: null,
    startTime: dayjs(),
    endTime: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para cronómetro - REMOVIDO
  
  // Estados para edición
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);

  // Cargar datos maestros al montar el componente
  useEffect(() => {
    loadMasterData();
    loadMyRecords();
  }, []); // Solo se ejecuta una vez al montar

  // Efecto para el cronómetro - REMOVIDO

  // Función para cargar datos maestros
  const loadMasterData = async () => {
    try {
      setLoading(true);
      const [locationsRes, cleaningTypesRes, productsRes] = await Promise.all([
        apiService.cleaning.getLocations(),
        apiService.cleaning.getCleaningTypes(),
        apiService.cleaning.getProducts(),
      ]);
  
      console.log("📍 locationsRes:", locationsRes);
      console.log("🧽 cleaningTypesRes:", cleaningTypesRes);
      console.log("📦 productsRes:", productsRes);
  
      // Normalizar siempre a arrays
      setLocations(
        Array.isArray(locationsRes)
          ? locationsRes
          : locationsRes?.locations || []
      );
  
      setCleaningTypes(
        Array.isArray(cleaningTypesRes)
          ? cleaningTypesRes
          : cleaningTypesRes?.cleaningTypes || []
      );
  
      setProducts(
        Array.isArray(productsRes)
          ? productsRes
          : productsRes?.products || []
      );
    } catch (error) {
      console.error('Error cargando datos maestros:', error);
      setError('Error cargando datos del sistema');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Función para cargar registros personales
  const loadMyRecords = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await apiService.cleaning.getMyRecords({
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setMyRecords(response.records || []);
      setTotalRecords(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error cargando registros:', error);
      setError('Error cargando registros');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const recordData = {
        locationId: parseInt(formData.locationId),
        cleaningTypeId: parseInt(formData.cleaningTypeId),
        productId: formData.products.length > 0 ? parseInt(formData.products[0]) : null,
        observations: formData.observations,
        // duration removido completamente
      };
      
      if (editingRecord) {
        // Actualizar registro existente
        await apiService.cleaning.updateRecord(editingRecord.id, recordData);
        setSuccess('Registro actualizado exitosamente');
      } else {
        // Crear nuevo registro
        await apiService.cleaning.createRecord(recordData);
        setSuccess('Registro creado exitosamente');
      }
      
      // Limpiar formulario y cerrar modal
      resetForm();
      setFormOpen(false);
      setEditFormOpen(false);
      setEditingRecord(null);
      
      // Recargar registros
      loadMyRecords();
      
    } catch (error) {
      console.error('Error guardando registro:', error);
      setError(error.message || 'Error guardando registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.locationId) {
      errors.locationId = 'La ubicación es requerida';
    }
    
    if (!formData.cleaningTypeId) {
      errors.cleaningTypeId = 'El tipo de limpieza es requerido';
    }
    
    if (formData.products.length === 0) {
      errors.products = 'Debe seleccionar al menos un producto';
    }
    
    if (formData.observations && formData.observations.length > 500) {
      errors.observations = 'Las observaciones no pueden exceder 500 caracteres';
    }
    
    return errors;
  };

  // Función para resetear formulario
  const resetForm = () => {
    setFormData({
      locationId: '',
      cleaningTypeId: '',
      products: [],
      observations: '',
      duration: null,
      startTime: dayjs(),
      endTime: null,
    });
    setFormErrors({});
  };

  // Función para manejar edición de registro
  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setFormData({
      locationId: record.locationId,
      cleaningTypeId: record.cleaningTypeId,
      products: record.products?.map(p => p.id) || [],
      observations: record.observations || '',
      duration: record.duration,
      startTime: dayjs(record.startTime),
      endTime: record.endTime ? dayjs(record.endTime) : null,
    });
    setEditFormOpen(true);
  };

  // Función para manejar eliminación de registro
  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
      try {
        setLoading(true);
        await apiService.cleaning.deleteRecord(recordId);
        setSuccess('Registro eliminado exitosamente');
        loadMyRecords();
      } catch (error) {
        console.error('Error eliminando registro:', error);
        setError(error.message || 'Error eliminando registro');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para formatear duración
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para verificar si un registro se puede editar
  const canEditRecord = (record) => {
    const recordTime = dayjs(record.createdAt);
    const now = dayjs();
    const hoursDiff = now.diff(recordTime, 'hour');
    return hoursDiff <= 6;
  };

  // Función para cerrar notificaciones
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setError(null);
    setSuccess(null);
  };

  // Componente del formulario de registro
  const RegistrationForm = ({ isEdit = false }) => (
    <Dialog 
      open={isEdit ? editFormOpen : formOpen} 
      onClose={() => {
        if (isEdit) {
          setEditFormOpen(false);
          setEditingRecord(null);
        } else {
          setFormOpen(false);
        }
        resetForm();
      }}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        {isEdit ? 'Editar Registro' : 'Nuevo Registro de Limpieza'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Ubicación */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.locationId}>
                <InputLabel>Ubicación *</InputLabel>
                <Select
                  value={formData.locationId}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                  label="Ubicación *"
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      <Box display="flex" alignItems="center">
                        <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                        {location.building} - {location.floor} - {location.room}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.locationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {formErrors.locationId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Tipo de Limpieza */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.cleaningTypeId}>
                <InputLabel>Tipo de Limpieza *</InputLabel>
                <Select
                  value={formData.cleaningTypeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cleaningTypeId: e.target.value }))}
                  label="Tipo de Limpieza *"
                >
                  {cleaningTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box display="flex" alignItems="center">
                        <CleaningIcon sx={{ mr: 1, fontSize: 20 }} />
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.cleaningTypeId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {formErrors.cleaningTypeId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Productos */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.products}>
                <InputLabel>Productos Utilizados *</InputLabel>
                <Select
                  multiple
                  value={formData.products}
                  onChange={(e) => setFormData(prev => ({ ...prev, products: e.target.value }))}
                  label="Productos Utilizados *"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const product = products.find(p => p.id === value);
                        return (
                          <Chip
                            key={value}
                            label={product?.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      <Box display="flex" alignItems="center">
                        <ProductIcon sx={{ mr: 1, fontSize: 20 }} />
                        {product.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.products && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {formErrors.products}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Cronómetro removido */}

            {/* Fechas manejadas automáticamente por el backend */}

            {/* Observaciones */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observaciones"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                error={!!formErrors.observations}
                helperText={formErrors.observations || `${formData.observations.length}/500 caracteres`}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              if (isEdit) {
                setEditFormOpen(false);
                setEditingRecord(null);
              } else {
                setFormOpen(false);
              }
              resetForm();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingPosition="start"
            startIcon={<CheckCircleIcon />}
          >
            {isEdit ? 'Actualizar' : 'Guardar'} Registro
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );

  // Componente de la lista de registros
  const RecordsList = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Mis Registros ({totalRecords})</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => loadMyRecords()}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : myRecords.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CleaningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay registros
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comience creando su primer registro de limpieza
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {myRecords.map((record) => (
            <Grid item xs={12} key={record.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {record.location?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {record.cleaningType?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      {canEditRecord(record) && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditRecord(record)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canEditRecord(record) && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRecord(record.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  
                  {record.products && record.products.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Productos utilizados:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {record.products.map((product) => (
                          <Chip
                            key={product.id}
                            label={product.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {record.duration && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Duración: {formatDuration(record.duration)}
                      </Typography>
                    </Box>
                  )}
                  
                  {record.observations && (
                    <Typography variant="body2" color="text.secondary">
                      {record.observations}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Componente del dashboard principal
  const DashboardView = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.name || user?.email}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Sistema de Registro de Limpieza y Desinfección - UPB
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Estadísticas rápidas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CleaningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary">
                    {myRecords.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registros Totales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <LocationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {locations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ubicaciones
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'tertiary.main', mr: 2 }}>
                  <ProductIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="tertiary.main">
                    {products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {myRecords.filter(r => canEditRecord(r)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Editables
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Acciones rápidas */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => setFormOpen(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Nuevo Registro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crear un nuevo registro de limpieza
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => setActiveTab('records')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <HistoryIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Ver Registros
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisar mis registros anteriores
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => loadMyRecords()}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <RefreshIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Actualizar Datos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sincronizar con el servidor
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
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
              Dashboard Operario - UPB
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
                  selected={activeTab === 'dashboard'}
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === 'records'}
                  onClick={() => {
                    setActiveTab('records');
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mis Registros" />
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
                  primary={user?.name || 'Usuario'}
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
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'records' && <RecordsList />}
          </Container>
        </Box>

        {/* FAB para nuevo registro */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setFormOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* Formularios */}
        <RegistrationForm />
        <RegistrationForm isEdit={true} />

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

export default DashboardOperator;
