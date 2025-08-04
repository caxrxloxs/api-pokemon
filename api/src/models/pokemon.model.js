import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  types: { type: [String], required: true },
  attacks: { type: [String], required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  sprite: { type: String }
}, { timestamps: true });

export const Pokemon = mongoose.model('Pokemon', pokemonSchema);