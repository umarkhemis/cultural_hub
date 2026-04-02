
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Globe } from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      setSession(response.data.user, response.data.tokens);
      router.push(getRedirectPathByRole(response.data.user.role));
    } catch {}
  };

  const inputClass =
    "w-full rounded-2xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Full-screen background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
          <Link href={ROUTES.welcome} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 shadow-lg shadow-amber-400/30 transition-transform group-hover:scale-105">
              <Globe className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              CulturalHub
            </span>
          </Link>

          <Link
            href={ROUTES.register}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            No account?{" "}
            <span className="font-semibold text-amber-400">Create one free</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-400">Welcome back</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign in to CulturalHub
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Continue your cultural journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                  {...register("email")}
                />
              </div>
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {loginMutation.isError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {getApiErrorMessage(loginMutation.error, "Login failed. Please try again.")}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-xs text-slate-300">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <p className="text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.register} className="font-semibold text-white hover:text-amber-400 transition-colors">
              Create one free
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400 leading-5">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

