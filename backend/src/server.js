require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const tagRoutes = require("./routes/tag.routes");
const relationRoutes = require("./routes/relation.routes");
const graphRoutes = require("./routes/graph.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/tags", tagRoutes);
app.use("/relations", relationRoutes);
app.use("/graph", graphRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});