//src/get-payload.ts
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import dotenv from "dotenv";
import path from "path";

//! This line of code ensures that the .env file is loaded and its variables are accessible within the Node.js environment.
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

//! Using Caching
let cached = (global as any).payload;
if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYlOAD_SECRET) {
    throw new Error("PAYlOAD_SECRET is missing");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYlOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
