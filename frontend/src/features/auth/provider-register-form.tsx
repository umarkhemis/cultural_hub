
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
  Globe, MapPin, Building2, FileText, AtSign, ArrowLeft,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { getApiErrorMessage } from "./get-error-message";
import { useProviderRegisterMutation } from "./hooks";
import { providerRegisterSchema, type ProviderRegisterFormValues } from "./schema";
import { BrandLogo } from "@/src/components/common/brand-logo";


type Props = { onBack?: () => void };

export function ProviderRegisterForm({ onBack }: Props) {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useProviderRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProviderRegisterFormValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      full_name: "", email: "", password: "", confirm_password: "",
      site_name: "", description: "", location: "", contact_email: "", contact_phone: "",
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
    "w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm";

  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4";

  // Always 2-col section label
  const SectionLabel = ({ number, label }: { number: string; label: string }) => (
    <div className="col-span-2 flex items-center gap-2 sm:gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-400 sm:h-6 sm:w-6">
        {number}
      </div>
      <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-200 sm:text-xs">{label}</h2>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );

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
        <div className="flex w-full max-w-3xl items-center justify-between py-4 sm:py-5">
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
            <span className="hidden sm:inline">Already have an account? </span>
            <span className="font-semibold text-amber-400">Sign in</span>
          </Link>
        </div>

        {/* Page heading */}
        <div className="mb-5 w-full max-w-3xl sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 mb-2.5 sm:gap-2 sm:px-3 sm:py-1.5 sm:mb-4">
            <Building2 className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] font-semibold text-amber-400 sm:text-xs">Provider Registration</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight sm:text-3xl lg:text-4xl">
            Share your cultural site
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-lg leading-5 sm:mt-2 sm:text-sm sm:leading-6">
            Connect with tourists seeking authentic experiences.
          </p>
        </div>

        {/* Form — always 2 columns */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-4 pb-8 sm:space-y-6">

          {/* Section 1 — Account */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <SectionLabel number="1" label="Account Details" />

            <FormField label="Full Name" htmlFor="full_name" error={errors.full_name?.message}>
              <div className="relative">
                <User className={iconClass} />
                <input id="full_name" placeholder="Your full name" autoComplete="name" className={inputClass} {...register("full_name")} />
              </div>
            </FormField>

            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <Mail className={iconClass} />
                <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...register("email")} />
              </div>
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Lock className={iconClass} />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" className={`${inputClass} pr-8 sm:pr-11`} {...register("password")} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors sm:right-3.5" tabIndex={-1} aria-label="Toggle password">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm Password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
              <div className="relative">
                <Lock className={iconClass} />
                <input id="confirm_password" type={showConfirm ? "text" : "password"} placeholder="Confirm password" autoComplete="new-password" className={`${inputClass} pr-8 sm:pr-11`} {...register("confirm_password")} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors sm:right-3.5" tabIndex={-1} aria-label="Toggle password">
                  {showConfirm ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </button>
              </div>
            </FormField>
          </div>

          {/* Section 2 — Cultural Site */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <SectionLabel number="2" label="Cultural Site Details" />

            <FormField label="Site Name" htmlFor="site_name" error={errors.site_name?.message}>
              <div className="relative">
                <Building2 className={iconClass} />
                <input id="site_name" placeholder="Kabale Heritage Tours" className={inputClass} {...register("site_name")} />
              </div>
            </FormField>

            <FormField label="Location" htmlFor="location" error={errors.location?.message}>
              <div className="relative">
                <MapPin className={iconClass} />
                <input id="location" placeholder="Kabale, Uganda" className={inputClass} {...register("location")} />
              </div>
            </FormField>

            {/* Description — full width (spans both columns) */}
            <div className="col-span-2">
              <FormField label="About Your Site" htmlFor="description" error={errors.description?.message}>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:top-3.5 sm:h-4 sm:w-4" />
                  <textarea
                    id="description"
                    placeholder="Describe the cultural experiences you offer to visitors..."
                    rows={3}
                    className="w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 resize-none sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm"
                    {...register("description")}
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 3 — Contact */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <SectionLabel number="3" label="Public Contact Info" />

            <FormField label="Contact Email" htmlFor="contact_email" error={errors.contact_email?.message}>
              <div className="relative">
                <AtSign className={iconClass} />
                <input id="contact_email" type="email" placeholder="contact@yoursite.com" className={inputClass} {...register("contact_email")} />
              </div>
            </FormField>

            <FormField label="Contact Phone" htmlFor="contact_phone" error={errors.contact_phone?.message}>
              <div className="relative">
                <Phone className={iconClass} />
                <input id="contact_phone" placeholder="0700000000" inputMode="tel" className={inputClass} {...register("contact_phone")} />
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
              <>Create Provider Account<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
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


