import app from './app.js';
import { connectMongo } from './config/db.js';

const PORT = process.env.PORT || 3000;

try {
  await connectMongo();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ Error al iniciar el servidor:', error.message);
  process.exit(1);
}