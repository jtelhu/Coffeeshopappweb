import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8eeb856c/health", (c) => {
  return c.json({ status: "ok" });
});

// User loyalty points endpoints
app.get("/make-server-8eeb856c/loyalty/:userId", async (c) => {
  const userId = c.req.param('userId');
  try {
    const points = await kv.get(`loyalty:${userId}`);
    return c.json({ points: points || 0 });
  } catch (error) {
    console.log(`Error fetching loyalty points for user ${userId}:`, error);
    return c.json({ error: 'Failed to fetch loyalty points' }, 500);
  }
});

app.post("/make-server-8eeb856c/loyalty/:userId", async (c) => {
  const userId = c.req.param('userId');
  try {
    const { points } = await c.req.json();
    await kv.set(`loyalty:${userId}`, points);
    return c.json({ success: true, points });
  } catch (error) {
    console.log(`Error updating loyalty points for user ${userId}:`, error);
    return c.json({ error: 'Failed to update loyalty points' }, 500);
  }
});

// Menu items endpoints
app.get("/make-server-8eeb856c/menu", async (c) => {
  try {
    const menuItems = await kv.getByPrefix('menu:');
    return c.json({ items: menuItems.map(item => item.value) });
  } catch (error) {
    console.log('Error fetching menu items:', error);
    return c.json({ error: 'Failed to fetch menu items' }, 500);
  }
});

app.post("/make-server-8eeb856c/menu", async (c) => {
  try {
    const item = await c.req.json();
    await kv.set(`menu:${item.id}`, item);
    return c.json({ success: true, item });
  } catch (error) {
    console.log('Error creating menu item:', error);
    return c.json({ error: 'Failed to create menu item' }, 500);
  }
});

app.put("/make-server-8eeb856c/menu/:id", async (c) => {
  const id = c.req.param('id');
  try {
    const item = await c.req.json();
    await kv.set(`menu:${id}`, { ...item, id });
    return c.json({ success: true, item: { ...item, id } });
  } catch (error) {
    console.log(`Error updating menu item ${id}:`, error);
    return c.json({ error: 'Failed to update menu item' }, 500);
  }
});

app.delete("/make-server-8eeb856c/menu/:id", async (c) => {
  const id = c.req.param('id');
  try {
    await kv.del(`menu:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting menu item ${id}:`, error);
    return c.json({ error: 'Failed to delete menu item' }, 500);
  }
});

// Ratings endpoints
app.post("/make-server-8eeb856c/ratings", async (c) => {
  try {
    const rating = await c.req.json();
    const ratingId = `rating:${rating.orderId}`;
    await kv.set(ratingId, rating);
    return c.json({ success: true, rating });
  } catch (error) {
    console.log('Error saving rating:', error);
    return c.json({ error: 'Failed to save rating' }, 500);
  }
});

app.get("/make-server-8eeb856c/ratings/:orderId", async (c) => {
  const orderId = c.req.param('orderId');
  try {
    const rating = await kv.get(`rating:${orderId}`);
    return c.json({ rating });
  } catch (error) {
    console.log(`Error fetching rating for order ${orderId}:`, error);
    return c.json({ error: 'Failed to fetch rating' }, 500);
  }
});

// Orders analytics endpoint
app.get("/make-server-8eeb856c/analytics/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    return c.json({ orders: orders.map(o => o.value) });
  } catch (error) {
    console.log('Error fetching orders for analytics:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

app.post("/make-server-8eeb856c/orders", async (c) => {
  try {
    const order = await c.req.json();
    await kv.set(`order:${order.id}`, order);
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error saving order:', error);
    return c.json({ error: 'Failed to save order' }, 500);
  }
});

// Inventory endpoints
app.get("/make-server-8eeb856c/inventory", async (c) => {
  try {
    const inventory = await kv.getByPrefix('inventory:');
    return c.json({ inventory: inventory.map(item => item.value) });
  } catch (error) {
    console.log('Error fetching inventory:', error);
    return c.json({ error: 'Failed to fetch inventory' }, 500);
  }
});

app.put("/make-server-8eeb856c/inventory/:id", async (c) => {
  const id = c.req.param('id');
  try {
    const { stock } = await c.req.json();
    await kv.set(`inventory:${id}`, { id, stock });
    return c.json({ success: true, stock });
  } catch (error) {
    console.log(`Error updating inventory for ${id}:`, error);
    return c.json({ error: 'Failed to update inventory' }, 500);
  }
});

Deno.serve(app.fetch);