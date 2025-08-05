import { PokemonRepository } from '../repositories/pokemon.repository.js';

export const PokemonService = {

    async getPokemonsPaginated({ page = 1, limit = 10, filters = {} }) {
        return PokemonRepository.getAllPaginated({ page, limit, filters });
    },

    async findById(id) {

        const pokemon = await PokemonRepository.findById(id);
        return pokemon;
    },

    async create(data) {
        const existing = await PokemonRepository.findByCode(data.code);
        if (existing) {
            const error = new Error('El código ya está en uso');
            error.statusCode = 409;
            throw error;
        }
        return await PokemonRepository.create(data);
    },

    async update(id, data) {
        const updated = await PokemonRepository.update(id, data);
        if (!updated) {
            const error = new Error('Pokemon no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return updated;
    },

    async remove(id) {
        const removed = await PokemonRepository.remove(id);
        if (!removed) {
            const error = new Error('Pokemon no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return removed;
    },


};