import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import marketRoutes from './routes/markets';
import communityRoutes from './routes/communities';
import { seedMarketsIfEmpty } from './seed';

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigin = allowedOrigins.includes('*') ? '*' : allowedOrigins;
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

const io = new Server(server, { cors: { origin: corsOrigin } });

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/communities', communityRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

io.on('connection', (socket) => {
  console.log('🔌 User connected');
  socket.on('new-comment', (data) => io.emit('comment', data));
  socket.on('price-update', (data) => io.emit('price-update', data));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await seedMarketsIfEmpty(prisma);
  server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
