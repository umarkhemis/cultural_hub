
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { ROUTES } from "@/src/constants/routes";
import { useLoginMutation } from "./hooks";
import { getApiErrorMessage } from "./get-error-message";
import { getRedirectPathByRole } from "./redirect-by-role";
import { loginSchema, type LoginFormValues } from "./schema";
import { useAuth } from "@/src/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      setSession(response.data.user, response.data.tokens);
      router.push(getRedirectPathByRole(response.data.user.role));
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        label="Email Address"
        htmlFor="email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      {loginMutation.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(loginMutation.error, "Login failed. Please try again.")}
        </div>
      ) : null}

      <Button type="submit" fullWidth disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-slate-900 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}