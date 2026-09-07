import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import dns from "node:dns/promises";
import cors from "cors";
import { addRoutes } from "./config/routes.config";

dotenv.config();

try {
    dns.setServers(["1.1.1.1"]);
} catch {
    // Ignore DNS server override errors if not permitted in host environment
}

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check / root route for Render
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Server is running smoothly" });
});

addRoutes(app);

async function bootstrap() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log("✅ Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
}

bootstrap();