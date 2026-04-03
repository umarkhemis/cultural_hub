// frontend\src\features\auth\tourist-register-form.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User,
  ArrowRight, Compass, ArrowLeft,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { useTouristRegisterMutation } from "./hooks";
import { getApiErrorMessage } from "./get-error-message";
import { touristRegisterSchema, type TouristRegisterFormValues } from "./schema";
import { ROUTES } from "@/src/constants/routes";
import { BrandLogo } from "@/src/components/common/brand-logo";


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

  // Slightly smaller padding on mobile so two columns always fit
  const inputClass =
    "w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm";

  return (
    <div className="relative min-h-screen w-full">
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-3 py-0 sm:px-6">

        {/* Top bar */}
        <div className="flex w-full max-w-2xl items-center justify-between py-4 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/15 hover:text-white transition-all active:scale-95 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
            {/* logo */}
            <BrandLogo size="sm" showTagline={false} />
          </div>
          <Link href={ROUTES.login} className="text-xs text-slate-300 hover:text-white transition-colors sm:text-sm">
            Have an account? <span className="font-semibold text-amber-400">Sign in</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-5 w-full max-w-2xl sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 mb-2.5 sm:gap-2 sm:px-3 sm:py-1.5 sm:mb-4">
            <Compass className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] font-semibold text-amber-400 sm:text-xs">Tourist Registration</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight sm:text-3xl lg:text-4xl">
            Start your cultural journey
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-md leading-5 sm:mt-2 sm:text-sm sm:leading-6">
            Join thousands of explorers discovering authentic cultural experiences.
          </p>
        </div>

        {/* Form — always 2 columns */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-3 pb-8 sm:space-y-5">

          {/* Name + Email — always side by side */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <FormField label="Full Name" htmlFor="full_name" error={errors.full_name?.message}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4" />
                <input id="full_name" placeholder="Your full name" autoComplete="name" className={inputClass} {...register("full_name")} />
              </div>
            </FormField>
            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4" />
                <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...register("email")} />
              </div>
            </FormField>
          </div>

          {/* Password + Confirm — always side by side */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-8 sm:pr-11`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors sm:right-3.5"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </button>
              </div>
            </FormField>
            <FormField label="Confirm Password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4" />
                <input
                  id="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-8 sm:pr-11`}
                  {...register("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors sm:right-3.5"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </button>
              </div>
            </FormField>
          </div>

          {registerMutation.isError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
              {getApiErrorMessage(registerMutation.error, "Registration failed. Please try again.")}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed sm:rounded-2xl sm:py-4"
          >
            {registerMutation.isPending ? (
              <><span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />Creating account...</>
            ) : (
              <>Create Tourist Account<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400 leading-5 sm:text-xs">
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

