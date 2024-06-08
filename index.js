import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

/* Middlewares */
app.use(express.json());
app.use(cors());

/* API Routes */
app.use("/api/users", userRoutes);

/* MongoDB connection */
const mongoURI = process.env.MONGODB_URI || "your-default-mongo-uri-here";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected..");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

/* Default Route */
app.get("/", (req, res) => {
  res.status(200).send("Welcome to LibraryApp");
});

/* Port Listening In */
const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

/* Graceful Shutdown */
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing HTTP server.");
  server.close(() => {
    console.log("HTTP server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
