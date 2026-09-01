import mongoose from "mongoose";

const LOCAL_URI = "mongodb://127.0.0.1:27017/monsterous-radio";

function isLocalMongoUri(uri: string): boolean {
  return /(?:127\.0\.0\.1|localhost)/.test(uri);
}

/** Resolve Mongo URI for the current runtime — never use localhost on Vercel. */
function resolveMongoUri(): string | null {
  const configured = process.env.MONGODB_URI?.trim();
  if (configured) {
    if (process.env.VERCEL && isLocalMongoUri(configured)) return null;
    return configured;
  }
  if (process.env.VERCEL) return null;
  return LOCAL_URI;
}

const MONGODB_URI = resolveMongoUri();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

export async function connectDb(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MongoDB is not configured for this environment");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 4_000,
        connectTimeoutMS: 4_000,
      })
      .then((conn) => {
        cached.conn = conn;
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  return cached.promise;
}
