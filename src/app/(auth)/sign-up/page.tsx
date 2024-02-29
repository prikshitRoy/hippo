"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ZodError } from "zod";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This email is already in use. Sign in instead?");

        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);

        return;
      }

      toast.error("Something went wrong. Please try again.");
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}.`);
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

  const Submit = ({ email, password }: TAuthCredentialsValidator) => {
    // sending data to server
    mutate({ email, password });
  };

  return (
    <>
      <div className="container relative flex pt-8 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-10 w-10" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1",
              })}
              href="/sign-in"
            >
              Already have an account? Sign-in
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            {/* Sign-Up Form */}
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

                  <Button>Sign up</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
