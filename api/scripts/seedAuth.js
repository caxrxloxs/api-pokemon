import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  try {
    const users = [
      {
        username: 'admin',
        email: 'admin@pokemonapi.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      },
      {
        username: 'trainer',
        email: 'trainer@pokemonapi.com',
        password: await bcrypt.hash('trainer123', 10),
        role: 'trainer'
      }
    ];

    // Eliminar usuarios existentes (opcional)
    await User.deleteMany({});

    // Insertar nuevos usuarios
    const createdUsers = await User.insertMany(users);
    
    console.log('Usuarios precargados creados:');
    createdUsers.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });

    return createdUsers;
  } catch (error) {
    console.error('Error en seedAuth:', error);
    throw error;
  }
};

// Ejecutar solo si es el módulo principal
if (process.argv.includes('--run-seed')) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedUsers };