import express from "express";
import expressproxy from "express-http-proxy";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Gateway!");
});

// Proxy for /api/auth to auth microservice (running on port 3001)
app.use("/api/auth", expressproxy("http://localhost:3001"));

app.use("/api/post", expressproxy("http://localhost:3002"));

// Start the gateway server
app.listen(PORT, () => {
  console.log(`Gateway is running on http://localhost:${PORT}`);
});
