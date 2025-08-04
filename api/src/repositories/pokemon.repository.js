import { Pokemon } from '../models/pokemon.model.js';

export const PokemonRepository = {

  async getAllPokemons({ page, limit }) {
    return Pokemon.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  },
  
  async countPokemons() {
    return Pokemon.countDocuments();
  },//<<< fin getAllPokemons con paginacion

findById: (id) => Pokemon.findById(id).lean(),
create: (data) => Pokemon.create(data),
update: (id, data) => Pokemon.findByIdAndUpdate(id, data, { new: true }).lean(),
remove: (id) => Pokemon.findByIdAndDelete(id).lean(),


};