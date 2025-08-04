import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemon.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pokemons', pokemonRoutes);
app.get('/api/ping', (req, res) => {
  console.log('¡Alguien hizo ping!');
  res.send('pong');
});


export default app;

