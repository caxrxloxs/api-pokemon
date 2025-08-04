import express from 'express';
import { PokemonController } from '../controllers/pokemon.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .get('/', PokemonController.getAllPokemons)
  .get('/:id', PokemonController.getPokemonById)
  .post('/', authMiddleware, PokemonController.createPokemon)
  .put('/:id', authMiddleware, PokemonController.updatePokemon)
  .delete('/:id', authMiddleware, PokemonController.deletePokemon);

export default router;