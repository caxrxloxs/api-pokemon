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
    console.log('[1] Llegó petición POST /pokemons'); // Log inicial
    const created = await PokemonService.create(req.body);
    res.status(201).json(created);
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

