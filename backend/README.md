# Sistema de Limpieza - Backend API

## 🚀 Configuración Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
```bash
# Levantar PostgreSQL con Docker
docker-compose up -d

# Configurar base de datos
npm run db:setup
```

### 3. Iniciar servidor
```bash
npm run dev
```

## 📋 Variables de Entorno

Copia `.env.example` a `.env` y configura las variables:

```env
DATABASE_URL="postgresql://dev:c0102@localhost:5432/registro_lyd_DB?schema=public"
JWT_SECRET="tu_jwt_secret_super_seguro"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## 🛡️ Características de Seguridad Implementadas

- ✅ **Rate Limiting**: Protección contra ataques de fuerza bruta
- ✅ **Validaciones**: Validación completa de entrada con express-validator
- ✅ **JWT**: Autenticación sin estado
- ✅ **bcrypt**: Hash seguro de contraseñas (12 rounds)
- ✅ **CORS**: Configurado para frontend específico
- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **Error Handling**: Manejo centralizado de errores

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Perfil actual
- `POST /api/auth/logout` - Cerrar sesión

### Operarios
- `GET /api/cleaning/locations` - Listar ubicaciones
- `GET /api/cleaning/products` - Listar productos  
- `GET /api/cleaning/cleaning-types` - Listar tipos de limpieza
- `POST /api/cleaning/records` - Crear registro
- `GET /api/cleaning/my-records` - Mis registros
- `PUT /api/cleaning/records/:id` - Editar registro (6h límite)
- `DELETE /api/cleaning/records/:id` - Eliminar registro (6h límite)

### Administradores
- `GET /api/admin/records` - Todos los registros con filtros
- `GET /api/admin/stats` - Estadísticas del dashboard
- `GET /api/admin/users` - Gestión de usuarios
- `PATCH /api/admin/users/:id/status` - Activar/desactivar usuario
- `GET /api/admin/records/export` - Exportar datos

## 🔒 Reglas de Negocio Implementadas

1. **Edición de Registros**: Solo 6 horas después de creación
2. **Campos Editables**: Solo observaciones y productos
3. **Roles**: OPERATOR y ADMIN
4. **Rate Limiting**: 
   - Login: 5 intentos/15min
   - Registro: 3 intentos/hora
   - General: 100 requests/15min

## 🧪 Usuarios de Prueba

```
Admin: admin@universidad.edu.co / admin123
Operario 1: operario1@universidad.edu.co / operator123  
Operario 2: operario2@universidad.edu.co / operator123
```

## 📝 Comandos Útiles

# 2. En /backend, configurar la base de datos completa
npm run db:setup

# 3. Ver los datos en interfaz gráfica (opcional)
npm run prisma:studio


```bash
npm run dev              # Desarrollo con nodemon
npm run prisma:studio    # UI para ver base de datos
npm run prisma:migrate   # Aplicar migraciones
npm run prisma:seed      # Poblar con datos de prueba
npm run prisma:reset     # Resetear base de datos
```