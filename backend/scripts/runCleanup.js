import dotenv from "dotenv";
import mongoose from "mongoose";
import { cleanupInactiveDocuments } from "../lib/cleanup.js";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri?.trim()) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

await mongoose.connect(uri);
const result = await cleanupInactiveDocuments();
console.log(result);
await mongoose.disconnect();
process.exit(0);
