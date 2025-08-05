import express from 'express';
import { PokemonController } from '../controllers/pokemon.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .get('/', PokemonController.getAllPokemons) //ok
  .get('/:id', PokemonController.getPokemonById) // ok
  .post('/', authMiddleware, PokemonController.createPokemon)//ok
  .put('/:id', authMiddleware, PokemonController.updatePokemon)//ok
  .delete('/:id', authMiddleware, PokemonController.deletePokemon);//ok

export default router;