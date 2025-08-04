
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'P1k@chu_Thunder_5t0n3_2025!',
  expiresIn: '2h',               
  saltRounds: 10
};