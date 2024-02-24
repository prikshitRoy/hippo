import { initTRPC } from "@trpc/server";

const t = initTRPC.context().create();
export const router = t.router;

//! Any one will be able to call this API-end point, its a public end point
export const publishProcedure = t.procedure;
