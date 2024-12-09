import express from "express";
import expressproxy from "express-http-proxy";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Gateway!");
});

app.use("/api/auth", expressproxy("http://localhost:3001"));

app.use("/api/post", expressproxy("http://localhost:3002"));

app.listen(PORT, () => {
  console.log(`Gateway is running on http://localhost:${PORT}`);
});
