
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

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Left panel — decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-12">

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Amber glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-amber-400 shadow-2xl shadow-amber-400/30">
              <Globe className="h-8 w-8 text-slate-900" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            Discover the world's cultural heritage
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Connect with authentic experiences, follow cultural sites,
            and book unforgettable journeys with verified providers.
          </p>

          {/* Testimonial / feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["500+ Cultural Sites", "Verified Providers", "Real Experiences", "Easy Booking"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400">
              <Globe className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-lg font-bold text-white">CulturalHub</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue your cultural journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <FormField
              label="Email Address"
              htmlFor="email"
              error={errors.email?.message}
            >
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none ring-0 transition-all focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20"
                  {...register("email")}
                />
              </div>
            </FormField>

            {/* Password */}
            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
            >
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none ring-0 transition-all focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />
                  }
                </button>
              </div>
            </FormField>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-slate-400 hover:text-amber-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Error message */}
            {loginMutation.isError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {getApiErrorMessage(loginMutation.error, "Login failed. Please try again.")}
              </div>
            )}

            {/* Submit button */}
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

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.register}
              className="font-semibold text-white hover:text-amber-400 transition-colors"
            >
              Create one free
            </Link>
          </p>

          {/* Legal */}
          <p className="mt-8 text-center text-xs text-slate-600 leading-5">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

