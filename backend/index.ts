import express, { Express } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import dns from "node:dns/promises";
import { addRoutes } from "./config/routes.config";

dotenv.config();

dns.setServers(["1.1.1.1"]);

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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