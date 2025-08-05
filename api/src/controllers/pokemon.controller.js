import { PokemonService } from '../services/pokemon.service.js';
import mongoose from 'mongoose';

export const PokemonController = {
  async getAllPokemons(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ error: 'page y limit deben ser números' });
      }
      const filters = {};
      const pokemons = await PokemonService.getPokemonsPaginated({ page, limit });
      res.json(pokemons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPokemonById(req, res) {

    const { id } = req.params;
    // Validar si el ID tiene un formato válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const pokemon = await PokemonService.findById(req.params.id);
      if (!pokemon) return res.status(404).json({ message: 'Pokemon no encontrado' });
      res.json(pokemon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  },

  async createPokemon(req, res) {
    try {
      const pokemon = await PokemonService.create({
        ...req.body,
        createdBy: req.user._id // Inyección del usuario autenticado
      });
      res.status(201).json(pokemon);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        error: error.message,
        details: error.details // Si aplica
      });
    }
  },

  async updatePokemon(req, res) {
    try {
      const updated = await PokemonService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletePokemon(req, res) {
    try {
      const removed = await PokemonService.remove(req.params.id);
      if (!removed) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  },

};

