import mongoose from 'mongoose';
import '../models/pokemon.model.js';

export const connectMongo = async () => {
  try {
    console.log('[1] 🔄 Iniciando conexión a MongoDB...');
    console.log('[1.1] Modelos disponibles ANTES de conectar:', mongoose.modelNames());
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[1.2] Modelos disponibles DESPUÉS de conectar:', mongoose.modelNames());
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};