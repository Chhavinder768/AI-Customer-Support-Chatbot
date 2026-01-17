import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import api from "./routes";

const app = new Hono();

app.use("*", cors());

// 👇 ADD THIS
app.get("/", (c) => c.text("ROOT OK"));

app.route("/api", api);

const port = 3000;
console.log(`🚀 Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
