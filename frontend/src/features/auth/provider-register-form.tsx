
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
  Globe, MapPin, Building2, FileText, AtSign, Shield, ArrowLeft,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { getApiErrorMessage } from "./get-error-message";
import { useProviderRegisterMutation } from "./hooks";
import { providerRegisterSchema, type ProviderRegisterFormValues } from "./schema";

type Props = { onBack?: () => void };

export function ProviderRegisterForm({ onBack }: Props) {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useProviderRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderRegisterFormValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      site_name: "",
      description: "",
      location: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  const onSubmit = async (values: ProviderRegisterFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        role: "provider",
        site_name: values.site_name,
        description: values.description,
        location: values.location,
        contact_email: values.contact_email || undefined,
        contact_phone: values.contact_phone || undefined,
      });
      setSession(response.data.user, response.data.tokens);
      router.push(ROUTES.providerRoot);
    } catch {}
  };

  const inputClass =
    "w-full rounded-2xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20";

  const SectionLabel = ({ number, label }: { number: string; label: string }) => (
    <div className="flex items-center gap-3 col-span-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-400">
        {number}
      </div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-200">{label}</h2>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">

      {/* Full-screen background image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-12 sm:px-6">

        {/* Top bar */}
        <div className="mb-10 flex w-full max-w-3xl items-center justify-between">
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
            <Link href={ROUTES.welcome} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 shadow-lg shadow-amber-400/30">
                <Globe className="h-5 w-5 text-slate-900" />
              </div>
              <span className="text-base font-bold text-white">CulturalHub</span>
            </Link>
          </div>
          <Link
            href={ROUTES.login}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Already have an account?{" "}
            <span className="font-semibold text-amber-400">Sign in</span>
          </Link>
        </div>

        {/* Page heading */}
        <div className="mb-8 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 mb-4">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">Provider Registration</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Share your cultural site
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-lg">
            Connect with tourists seeking authentic experiences.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-6">

          {/* Section 1 — Account */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SectionLabel number="1" label="Account Details" />

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

          {/* Section 2 — Cultural Site */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SectionLabel number="2" label="Cultural Site Details" />

            <FormField label="Site Name" htmlFor="site_name" error={errors.site_name?.message}>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="site_name" placeholder="Kabale Heritage Tours" className={inputClass} {...register("site_name")} />
              </div>
            </FormField>

            <FormField label="Location" htmlFor="location" error={errors.location?.message}>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="location" placeholder="Kabale, Uganda" className={inputClass} {...register("location")} />
              </div>
            </FormField>

            <div className="col-span-2">
              <FormField label="About Your Site" htmlFor="description" error={errors.description?.message}>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300 pointer-events-none" />
                  <textarea
                    id="description"
                    placeholder="Describe the cultural experiences you offer to visitors..."
                    rows={3}
                    className="w-full rounded-2xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 resize-none"
                    {...register("description")}
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 3 — Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SectionLabel number="3" label="Public Contact Info" />

            <FormField label="Contact Email" htmlFor="contact_email" error={errors.contact_email?.message}>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="contact_email" type="email" placeholder="contact@yoursite.com" className={inputClass} {...register("contact_email")} />
              </div>
            </FormField>

            <FormField label="Contact Phone" htmlFor="contact_phone" error={errors.contact_phone?.message}>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                <input id="contact_phone" placeholder="0700000000" className={inputClass} {...register("contact_phone")} />
              </div>
            </FormField>
          </div>

          {registerMutation.isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {getApiErrorMessage(registerMutation.error, "Registration failed. Please try again.")}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-sm font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? (
              <><span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />Creating your account...</>
            ) : (
              <>Create Provider Account<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
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
