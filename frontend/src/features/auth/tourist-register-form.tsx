
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User,
  ArrowRight, Globe, Compass, ArrowLeft,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { useTouristRegisterMutation } from "./hooks";
import { getApiErrorMessage } from "./get-error-message";
import { touristRegisterSchema, type TouristRegisterFormValues } from "./schema";
import { ROUTES } from "@/src/constants/routes";

type Props = { onBack?: () => void };

export function TouristRegisterForm({ onBack }: Props) {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useTouristRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<TouristRegisterFormValues>({
    resolver: zodResolver(touristRegisterSchema),
    defaultValues: { full_name: "", email: "", phone: "", password: "", confirm_password: "" },
  });

  const onSubmit = async (values: TouristRegisterFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        role: "tourist",
      });
      setSession(response.data.user, response.data.tokens);
      router.push(ROUTES.feed);
    } catch {}
  };

  const inputClass =
    "w-full rounded-2xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
      <div className="fixed inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-12 sm:px-6">

        {/* Top bar */}
        <div className="mb-10 flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/15 hover:text-white transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <Link href={ROUTES.welcome} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400">
                <Globe className="h-4 w-4 text-slate-900" />
              </div>
              <span className="text-sm font-bold text-white">CulturalHub</span>
            </Link>
          </div>
          <Link href={ROUTES.login} className="text-sm text-slate-300 hover:text-white transition-colors">
            Have an account? <span className="font-semibold text-amber-400">Sign in</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 mb-4">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">Tourist Registration</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Start your cultural journey</h1>
          <p className="mt-2 text-sm text-slate-300 max-w-md">
            Join thousands of explorers discovering the world's most authentic cultural experiences.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="full_name" error={errors.full_name?.message}>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="full_name" placeholder="Your full name" autoComplete="name" className={inputClass} {...register("full_name")} />
              </div>
            </FormField>
            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...register("email")} />
              </div>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" className={`${inputClass} pr-11`} {...register("password")} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <FormField label="Confirm Password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="confirm_password" type={showConfirm ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password" className={`${inputClass} pr-11`} {...register("confirm_password")} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
          </div>

          {registerMutation.isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {getApiErrorMessage(registerMutation.error, "Registration failed. Please try again.")}
            </div>
          )}

          <button type="submit" disabled={registerMutation.isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-sm font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? (
              <><span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />Creating your account...</>
            ) : (
              <>Create Tourist Account<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 leading-5 pb-4">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">Privacy Policy</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

