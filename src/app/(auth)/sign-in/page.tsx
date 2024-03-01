"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/Icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: async () => {
      toast.success("Signed in sucessfully");

      if (origin) {
        router.push(`/$(origin)`);
        return;
      }

      if (isSeller) {
        router.push(`/sell`);
        return;
      }

      router.push("/");

      router.refresh();
    },

    onError: (errors) => {
      if (errors.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");
      }
    },
  });

  const Submit = ({ email, password }: TAuthCredentialsValidator) => {
    // sending data to server
    signIn({ email, password });
  };

  return (
    <>
      <div className="container relative flex pt-8 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-nowrap">
              Sign in to your {isSeller ? "seller" : ""} account
            </h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1",
              })}
              href="/sign-up"
            >
              Don&apos; have an account?
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            {/* Sign-In Form */}
            <div className="grid gap-6">
              <form onSubmit={handleSubmit(Submit)}>
                <div className="grid gap-2">
                  {/* Email Field */}
                  <div className="grid gap-1 py-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email")}
                      className={cn({
                        "focus-visible:ring-red-500": errors.email,
                      })}
                      placeholder="you@example.com"
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-1 py-1">
                    <Label htmlFor="Password">Password</Label>
                    <Input
                      {...register("password")}
                      type="password"
                      className={cn({
                        "focus-visible:ring-red-500": errors.password,
                      })}
                      placeholder="Password"
                    />
                    {errors?.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign in
                  </Button>
                </div>
              </form>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              {isSeller ? (
                <Button
                  onClick={continueAsBuyer}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Continue as customer
                </Button>
              ) : (
                <Button
                  onClick={continueAsSeller}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Continue as seller
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
