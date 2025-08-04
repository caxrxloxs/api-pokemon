import { PokemonService } from '../services/pokemon.service.js';

export const PokemonController = {
  async getAllPokemons(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const pokemons = await PokemonService.getAllPokemons({ page, limit });
      res.json(pokemons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPokemonById(req, res) {

    const pokemon = await PokemonService.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ message: 'Pokemon no encontrado' });
    res.json(pokemon);
  },

  async createPokemon(req, res) {
    console.log('[Pokemon] Creando pokémon con datos:', req.body);

    try {
      // Validación básica
      const requiredFields = ['code', 'name', 'types', 'attacks', 'weight', 'height'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        console.log('[Pokemon] Faltan campos:', missingFields);
        return res.status(400).json({
          error: 'Faltan campos requeridos',
          missingFields
        });
      }

      // Verificar si el código ya existe
      const existing = await Pokemon.findOne({ code: req.body.code });
      if (existing) {
        console.log('[Pokemon] Código ya existe:', req.body.code);
        return res.status(409).json({ error: 'El código ya está en uso' });
      }

      const created = await PokemonService.create({
        ...req.body,
        createdBy: req.user._id // Asignar usuario creador
      });

      console.log('[Pokemon] Creado exitosamente:', created._id);
      res.status(201).json(created);
    } catch (error) {
      console.error('[Pokemon] Error al crear:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updatePokemon(req, res) {
    const updated = await PokemonService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  },

  async deletePokemon(req, res) {

    const removed = await PokemonService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  },

};

