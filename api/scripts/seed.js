import fetch from 'node-fetch';
import { connectMongo } from '../src/config/db.js';
import { Pokemon } from '../src/models/pokemon.model.js';
import { User } from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';

// Configuración
const POKEMON_LIMIT = 150; 
const ADMIN_PASSWORD = 'admin123';
const TRAINER_PASSWORD = 'trainer123';

async function getPokemon(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error(`Error fetching Pokémon ${id}`);
    
    const data = await res.json();
    return {
      code: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      attacks: data.moves.slice(0, 4).map(m => m.move.name),
      weight: data.weight / 10,
      height: data.height / 10,
      createdAt: new Date()
    };
  } catch (error) {
    console.error(`Error procesando Pokémon ${id}:`, error.message);
    return null;
  }
}

async function createDefaultUsers() {
  try {
    const users = [
      {
        username: 'admin',
        email: 'admin@pokemon.com',
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: 'admin',
        createdAt: new Date()
      },
      {
        username: 'trainer',
        email: 'trainer@pokemon.com',
        password: await bcrypt.hash(TRAINER_PASSWORD, 10),
        role: 'trainer',
        createdAt: new Date()
      }
    ];

    await User.deleteMany({});
    await User.insertMany(users);
    console.log('✅ Usuarios por defecto creados:');
    console.log(`- admin (password: ${ADMIN_PASSWORD})`);
    console.log(`- trainer (password: ${TRAINER_PASSWORD})`);
  } catch (error) {
    console.error('❌ Error creando usuarios:', error.message);
    throw error;
  }
}

async function seedPokemons() {
  try {
    console.log('⬇️  Descargando info de PokeAPI…');
    
    const pokemonDocs = [];
    for (let id = 1; id <= POKEMON_LIMIT; id++) {
      const pokemon = await getPokemon(id);
      if (pokemon) pokemonDocs.push(pokemon);
      process.stdout.write(`Procesando Pokémon: ${id}/${POKEMON_LIMIT}\r`);
    }

    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonDocs);
    console.log(`\n✅ Insertados ${pokemonDocs.length} pokémones (1-${POKEMON_LIMIT})`);
  } catch (error) {
    console.error('❌ Error cargando pokémones:', error.message);
    throw error;
  }
}

async function seed() {
  try {
    await connectMongo();
    
    // 1. Crear usuarios
    await createDefaultUsers();
    
    // 2. Cargar pokémones
    await seedPokemons();
    
    console.log('🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('🔥 Error en el proceso de seed:', error.message);
    process.exit(1);
  }
}

seed();