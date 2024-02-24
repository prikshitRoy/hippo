import { publishProcedure, router } from "./trpc";

export const appRouter = router({
  //! Inside developer can define any API route. Example 👇 Hello
  anyApiRoute: publishProcedure.query(() => {
    return "Hello";
  }),
});

export type AppRouter = typeof appRouter;
