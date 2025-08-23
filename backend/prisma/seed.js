const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // 1. Crear usuarios de prueba
    console.log('👥 Creando usuarios...');
    
    const adminPassword = await bcrypt.hash('admin123', 12);
    const operatorPassword = await bcrypt.hash('operator123', 12);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@upb.edu.co' },
      update: {},
      create: {
        email: 'admin@upb.edu.co',
        name: 'Administrador Sistema',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const operator1 = await prisma.user.upsert({
      where: { email: 'operario1@upb.edu.co' },
      update: {},
      create: {
        email: 'operario1@upb.edu.co',
        name: 'María González',
        password: operatorPassword,
        role: 'OPERATOR',
      },
    });

    const operator2 = await prisma.user.upsert({
      where: { email: 'operario2@upb.edu.co' },
      update: {},
      create: {
        email: 'operario2@upb.edu.co',
        name: 'Carlos Ramírez',
        password: operatorPassword,
        role: 'OPERATOR',
      },
    });

    console.log(`✅ Usuarios creados: Admin, 2 Operarios`);

    // 2. Crear ubicaciones (basado en el proyecto UPB)
    console.log('📍 Creando ubicaciones...');
    
    const locations = [
      // Bloque 9 - Baños
      { building: 'Bloque 9', floor: 'Piso 1', room: 'Baño Hombres 1', type: 'BATHROOM', description: 'Baño principal hombres piso 1' },
      { building: 'Bloque 9', floor: 'Piso 1', room: 'Baño Mujeres 1', type: 'BATHROOM', description: 'Baño principal mujeres piso 1' },
      { building: 'Bloque 9', floor: 'Piso 2', room: 'Baño Hombres 2', type: 'BATHROOM', description: 'Baño principal hombres piso 2' },
      { building: 'Bloque 9', floor: 'Piso 2', room: 'Baño Mujeres 2', type: 'BATHROOM', description: 'Baño principal mujeres piso 2' },
      
      // Bloque 9 - Aulas
      { building: 'Bloque 9', floor: 'Piso 1', room: 'Aula 101', type: 'CLASSROOM', description: 'Aula de clases' },
      { building: 'Bloque 9', floor: 'Piso 1', room: 'Aula 102', type: 'CLASSROOM', description: 'Aula de clases' },
      { building: 'Bloque 9', floor: 'Piso 1', room: 'Aula 103', type: 'CLASSROOM', description: 'Aula de clases' },
      { building: 'Bloque 9', floor: 'Piso 2', room: 'Aula 201', type: 'CLASSROOM', description: 'Aula de clases' },
      { building: 'Bloque 9', floor: 'Piso 2', room: 'Aula 202', type: 'CLASSROOM', description: 'Aula de clases' },
      { building: 'Bloque 9', floor: 'Piso 2', room: 'Lab Sistemas', type: 'CLASSROOM', description: 'Laboratorio de sistemas' },
      
      // Bloque 10 - Oficinas y otros
      { building: 'Bloque 10', floor: 'Piso 1', room: 'Oficina Coordinación', type: 'OFFICE', description: 'Oficina coordinación académica' },
      { building: 'Bloque 10', floor: 'Piso 1', room: 'Sala Profesores', type: 'OFFICE', description: 'Sala de profesores' },
      { building: 'Bloque 10', floor: 'Piso 1', room: 'Pasillo Principal', type: 'HALLWAY', description: 'Pasillo principal de acceso' },
      
      // Biblioteca
      { building: 'Biblioteca', floor: 'Piso 1', room: 'Sala General', type: 'COMMON_AREA', description: 'Sala de estudio general' },
      { building: 'Biblioteca', floor: 'Piso 1', room: 'Baños Biblioteca', type: 'BATHROOM', description: 'Baños de la biblioteca' },
      
    ];

    for (const locationData of locations) {
      await prisma.location.upsert({
        where: {
          building_floor_room: {
            building: locationData.building,
            floor: locationData.floor || '',
            room: locationData.room
          }
        },
        update: {},
        create: locationData,
      });
    }

    console.log(`✅ ${locations.length} ubicaciones creadas`);

    // 3. Crear tipos de limpieza
    console.log('🧹 Creando tipos de limpieza...');
    
    const cleaningTypes = [
      {
        name: 'Limpieza General',
        description: 'Limpieza básica General: barrido, trapeado, vaciado de basuras'
      },
      {
        name: 'Limpieza Profunda',
        description: 'Limpieza completa: incluye desinfección, limpieza de superficies y ventanas'
      },
      {
        name: 'Sanitización',
        description: 'Desinfección especializada con productos sanitizantes'
      },
      {
        name: 'Mantenimiento Preventivo',
        description: 'Limpieza de filtros, rejillas y elementos de difícil acceso'
      },
      {
        name: 'Limpieza de Emergencia',
        description: 'Limpieza urgente por derrames o situaciones especiales'
      }
    ];

    for (const cleaningTypeData of cleaningTypes) {
      await prisma.cleaningType.upsert({
        where: { name: cleaningTypeData.name },
        update: {},
        create: cleaningTypeData,
      });
    }

    console.log(`✅ ${cleaningTypes.length} tipos de limpieza creados`);

    // 4. Crear productos de limpieza
    console.log('🧴 Creando productos de limpieza...');
    
    const products = [
      {
        name: 'Detergente Multiusos',
        brand: 'Fabuloso',
        type: 'Detergente',
        description: 'Limpiador multiusos para superficies generales'
      },
      {
        name: 'Desinfectante Antibacterial',
        brand: 'Lysol',
        type: 'Desinfectante',
        description: 'Desinfectante que elimina 99.9% de bacterias y virus'
      },
      {
        name: 'Limpiador de Vidrios',
        brand: 'Windex',
        type: 'Limpiador especializado',
        description: 'Limpiador especial para ventanas y superficies de vidrio'
      },
      {
        name: 'Limpiador de Pisos',
        brand: 'Pinesol',
        type: 'Limpiador',
        description: 'Limpiador y desinfectante para pisos'
      },
      {
        name: 'Desengrasante Industrial',
        brand: 'Easy-Off',
        type: 'Desengrasante',
        description: 'Desengrasante para cocinas y áreas con grasa'
      },
      {
        name: 'Limpiador de Baños',
        brand: 'Clorox',
        type: 'Limpiador especializado',
        description: 'Limpiador específico para sanitarios y baños'
      },
      {
        name: 'Alcohol Antiséptico 70%',
        brand: 'Genérico',
        type: 'Antiséptico',
        description: 'Alcohol isopropílico para desinfección rápida'
      },
      {
        name: 'Jabón Líquido Antibacterial',
        brand: 'Protex',
        type: 'Jabón',
        description: 'Jabón líquido con propiedades antibacteriales'
      }
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { name: productData.name },
        update: {},
        create: productData,
      });
    }

    console.log(`✅ ${products.length} productos creados`);

    // 5. Crear algunos registros de limpieza de ejemplo
    console.log('📝 Creando registros de ejemplo...');
    
    // Obtener IDs para crear registros de ejemplo
    const firstLocation = await prisma.location.findFirst();
    const firstCleaningType = await prisma.cleaningType.findFirst();
    const firstProduct = await prisma.product.findFirst();

    const sampleRecords = [
      {
        userId: operator1.id,
        locationId: firstLocation.id,
        cleaningTypeId: firstCleaningType.id,
        productId: firstProduct.id,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15 minutos después
        duration: 15,
        observations: 'Limpieza completada sin novedades'
      },
      {
        userId: operator2.id,
        locationId: firstLocation.id,
        cleaningTypeId: firstCleaningType.id,
        productId: firstProduct.id,
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 20 * 60 * 1000), // 20 minutos después
        duration: 20,
        observations: 'Se requiere más producto desinfectante'
      },
      {
        userId: operator1.id,
        locationId: firstLocation.id,
        cleaningTypeId: firstCleaningType.id,
        productId: null,
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        endTime: new Date(Date.now() - 6 * 60 * 60 * 1000 + 10 * 60 * 1000), // 10 minutos después
        duration: 10,
        observations: 'Limpieza básica de rutina'
      }
    ];

    for (const recordData of sampleRecords) {
      await prisma.cleaningRecord.create({
        data: recordData
      });
    }

    console.log(`✅ ${sampleRecords.length} registros de ejemplo creados`);

    // 6. Actualizar el schema para agregar índice único compuesto
    // Esto se hace en el schema.prisma, no en el seed
    
    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`👥 Usuarios: ${await prisma.user.count()}`);
    console.log(`📍 Ubicaciones: ${await prisma.location.count()}`);
    console.log(`🧹 Tipos de limpieza: ${await prisma.cleaningType.count()}`);
    console.log(`🧴 Productos: ${await prisma.product.count()}`);
    console.log(`📝 Registros: ${await prisma.cleaningRecord.count()}`);
    
    console.log('\n🔐 Usuarios de prueba creados:');
    console.log('📧 admin@upb.edu.co (Contraseña: admin123) - ROL: ADMIN');
    console.log('📧 operario1@upb.edu.co (Contraseña: operator123) - ROL: OPERATOR');
    console.log('📧 operario2@upb.edu.co (Contraseña: operator123) - ROL: OPERATOR');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Conexión a la base de datos cerrada correctamente');
  })
  .catch(async (e) => {
    console.error('❌ Error fatal en el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });