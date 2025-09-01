// backend/src/index.js (or backend/index.js)
// ES module style — matches your existing imports

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"; // you said app/server are created here

dotenv.config();

//
// ----- Small safety wrapper: normalize accidental full-URL route strings -----
// This prevents path-to-regexp from crashing when something passes "https://..." as a route.
function normalizeRoute(route) {
  if (!route) return "/";
  try {
    // If it's a full URL, return only the pathname (e.g. "/webhook")
    return new URL(route).pathname || "/";
  } catch (e) {
    // Not a full URL — return as-is (also safe for RegExp, routers, arrays)
    return route;
  }
}

// Wrap common app registration methods to automatically normalize string paths.
// This is lightweight and safe — only touches string first arguments.
["use", "get", "post", "put", "delete", "all"].forEach((fnName) => {
  const original = app[fnName].bind(app);
  app[fnName] = (pathArg, ...rest) => {
    const safePath =
      typeof pathArg === "string" ? normalizeRoute(pathArg) : pathArg;
    return original(safePath, ...rest);
  };
});
// ---------------------------------------------------------------------------

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Standard middleware
app.use(express.json());
app.use(cookieParser());

// Allow cross-origin from your frontend; you can set CLIENT_URL in env for deploy
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Adjust the path if your build output is different
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server and connect DB
server.listen(PORT, () => {
  console.log(`✅ Server is running on PORT ${PORT}`);
  connectDB().catch((err) => {
    console.error("Failed to connect to DB:", err);
    // optional: process.exit(1);
  });
});

// Optional: graceful shutdown (handy on platforms like Render)
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down...`);
  server.close(() => {
    console.log("HTTP server closed.");
    // close DB connection if your connectDB returns a client/connection handle
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error("Forcing shutdown.");
    process.exit(1);
  }, 10000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
