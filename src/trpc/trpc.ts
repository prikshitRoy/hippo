import { ExpressContext } from "../server";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<ExpressContext>().create();
export const router = t.router;

//! Any one will be able to call this API-end point, its a public end point
export const publicProcedure = t.procedure;
