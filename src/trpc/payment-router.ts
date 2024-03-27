import { z } from "zod";
import type Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { privateProcedure, router } from "./trpc";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      //! FInding the Stripe-ID
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter((prod) => Boolean(prod.prideId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      });

      //   We are doing this so we can push 2 things into it
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      filteredProducts.forEach((products) => {
        line_items.push({
          price: products.prideId!,
          quantity: 1,
        });
      });
      line_items.push({
        price: "price_1Oxl86SFIRxpMUr9AT2TrVYI",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (error) {
        console.log("payment-router.ts Error =>", error);

        return { url: null };
      }
    }),
});
