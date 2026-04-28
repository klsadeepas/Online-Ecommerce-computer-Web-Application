import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  const PORT = 3000;

  app.use(express.json());

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-order', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`Socket ${socket.id} joined order-${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Recommendation Endpoint (Deprecated in favor of frontend calls, but kept with fix for safety)
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { userPreferences, currentProduct } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `As a tech expert for "TechHaven" store, recommend 3 products based on:
        Preferences: ${userPreferences}
        Current Product: ${currentProduct}
        Return JSON array of objects with fields: name, reason (brief).`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const recommendations = JSON.parse(result.text || '[]');
      res.json(recommendations);
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  // Stripe Checkout Endpoint
  app.post('/api/checkout/create-session', async (req, res) => {
    try {
      const { items, successUrl, cancelUrl } = req.body;
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret) throw new Error('STRIPE_SECRET_KEY is missing');

      const stripe = new Stripe(stripeSecret);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.images,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error('Stripe Error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Real-time Order Update Proxy (for admin to trigger)
  app.post('/api/orders/:orderId/update-status', (req, res) => {
    const { orderId } = req.params;
    const { status, location } = req.body;
    
    // Broadcast to the user watching this order
    io.to(`order-${orderId}`).emit('order-updated', { status, location });
    
    res.json({ success: true });
  });

  // Vite/Static Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
