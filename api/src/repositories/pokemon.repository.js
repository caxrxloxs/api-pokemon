import { Pokemon } from '../models/pokemon.model.js';

export const PokemonRepository = {
  // 1. Búsqueda paginada con filtros (para futuros features)
  
  async getAllPaginated({ page = 1, limit = 10, filters = {} }) {
    const [data, total] = await Promise.all([
      Pokemon.find(filters).skip((page - 1) * limit).limit(limit).lean(),
      Pokemon.countDocuments(filters),
    ]);
    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // 2. Conteo con filtros
  async count(filters = {}) {
    return Pokemon.countDocuments(filters);
  },

  // 3. Búsqueda por ID (con opción lean configurable)
  async findById(id, lean = true) {
    return lean
      ? Pokemon.findById(id).lean()
      : Pokemon.findById(id);
  },

  // 4. Creación con manejo de errores de duplicados
  async create(data) {
    try {
      return await Pokemon.create(data);
    } catch (error) {
      // Error 11000 = Violación de índice único en MongoDB
      if (error.code === 11000) {
        throw new Error('El código o nombre ya existe');
      }
      throw error;
    }
  },

  // 5. Actualización con validación
  async update(id, data) {
    const updated = await Pokemon.findByIdAndUpdate(
      id,
      data,
      {
        new: true,         // Devuelve el documento actualizado
        runValidators: true // Ejecuta validaciones del schema
      }
    );
    if (!updated) throw new Error('Pokémon no encontrado');
    return updated;
  },

  // 6. Eliminación con verificación
  async remove(id) {
    const deleted = await Pokemon.findByIdAndDelete(id);
    if (!deleted) throw new Error('Pokémon no encontrado');
    return deleted;
  },

  // 7. Búsqueda por código (para validaciones en el service)
  async findByCode(code) {
    return Pokemon.findOne({ code }).lean();
  }
};