import { PokemonRepository } from '../repositories/pokemon.repository.js';

export const PokemonService = {
    async getAllPokemons({ page, limit }) {

        const [list, total] = await Promise.all([
            PokemonRepository.getAllPokemons({ page, limit }),
            PokemonRepository.countPokemons()
        ]);

        return {
            data: list,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },//<< fin getAllPokemons 

    async findById(id) {
        
        const pokemon = await PokemonRepository.findById(id);
        return pokemon;
    },

    async create(data) {
        console.log('[4] Service - Creando pokémon con datos:', data);
        const created = await PokemonRepository.create(data);
        return created;
    },

    async update(id, data) {
        const updated = await PokemonRepository.update(id, data);
        return updated;
    },
    async remove(id) {
        
        const removed = await PokemonRepository.remove(id);
        return removed;
    },


};