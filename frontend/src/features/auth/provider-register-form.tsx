
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
  Globe, MapPin, Building2, FileText, AtSign,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { getApiErrorMessage } from "./get-error-message";
import { useProviderRegisterMutation } from "./hooks";
import { providerRegisterSchema, type ProviderRegisterFormValues } from "./schema";

export function ProviderRegisterForm() {
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
      phone: "",
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
        phone: values.phone || undefined,
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
    "w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none ring-0 transition-all focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20";

  const textareaClass =
    "w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none ring-0 transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 resize-none min-h-[88px]";

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-12 sticky top-0 h-screen">

        {/* Background dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Amber glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 max-w-xs text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-amber-400 shadow-2xl shadow-amber-400/30">
              <Building2 className="h-8 w-8 text-slate-900" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Share your cultural site with the world
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Become a verified provider and connect with tourists seeking
            authentic cultural experiences.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Verified Badge", "Global Reach", "Sell Packages", "Grow Followers"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Pending verification notice */}
          <div className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-left">
            <p className="text-xs font-semibold text-amber-400 mb-1">Pending verification</p>
            <p className="text-xs text-slate-400 leading-5">
              Your account will be reviewed by our team before going live. This usually takes 1–2 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — scrollable form */}
      <div className="flex w-full lg:w-3/5 flex-col items-center px-6 py-12 sm:px-12 overflow-y-auto">
        <div className="w-full max-w-lg">

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
              Become a provider
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Set up your cultural site and start sharing experiences
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ── Section 1: Account ─────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-400">1</div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Account Details</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <FormField label="Full Name" htmlFor="full_name" error={errors.full_name?.message}>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="full_name"
                    placeholder="Your full name"
                    autoComplete="name"
                    className={inputClass}
                    {...register("full_name")}
                  />
                </div>
              </FormField>

              <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
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

              <FormField label="Phone Number" htmlFor="phone" hint="Optional" error={errors.phone?.message}>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="phone"
                    placeholder="0700000000"
                    autoComplete="tel"
                    className={inputClass}
                    {...register("phone")}
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Password" htmlFor="password" error={errors.password?.message}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className={`${inputClass} pr-11`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm Password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      id="confirm_password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className={`${inputClass} pr-11`}
                      {...register("confirm_password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>
              </div>
            </div>

            {/* ── Section 2: Cultural Site ───────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-400">2</div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Cultural Site Details</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <FormField label="Site Name" htmlFor="site_name" error={errors.site_name?.message}>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="site_name"
                    placeholder="Kabale Heritage Tours"
                    className={inputClass}
                    {...register("site_name")}
                  />
                </div>
              </FormField>

              <FormField label="About Your Site" htmlFor="description" error={errors.description?.message}>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  <textarea
                    id="description"
                    placeholder="Describe the cultural experiences you offer..."
                    className={`${textareaClass} pl-10`}
                    {...register("description")}
                  />
                </div>
              </FormField>

              <FormField label="Location" htmlFor="location" error={errors.location?.message}>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="location"
                    placeholder="Kabale, Uganda"
                    className={inputClass}
                    {...register("location")}
                  />
                </div>
              </FormField>
            </div>

            {/* ── Section 3: Contact ─────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-400">3</div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Public Contact Info</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <p className="text-xs text-slate-500 -mt-1">
                Provide at least one public contact method for tourists.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Contact Email" htmlFor="contact_email" error={errors.contact_email?.message}>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      id="contact_email"
                      type="email"
                      placeholder="contact@example.com"
                      className={inputClass}
                      {...register("contact_email")}
                    />
                  </div>
                </FormField>

                <FormField label="Contact Phone" htmlFor="contact_phone" error={errors.contact_phone?.message}>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      id="contact_phone"
                      placeholder="0700000000"
                      className={inputClass}
                      {...register("contact_phone")}
                    />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Mobile pending notice */}
            {/* <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 lg:hidden">
              <p className="text-xs font-semibold text-amber-400 mb-1">Pending verification</p>
              <p className="text-xs text-slate-400 leading-5">
                Your account will be reviewed before going live. This usually takes 1–2 business days.
              </p>
            </div> */}

            {/* Error */}
            {registerMutation.isError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {getApiErrorMessage(registerMutation.error, "Provider registration failed. Please try again.")}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
                  Creating provider account...
                </>
              ) : (
                <>
                  Create Provider Account
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

          {/* Login link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href={ROUTES.login} className="font-semibold text-white hover:text-amber-400 transition-colors">
              Sign in
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










































// "use client";

// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/src/components/ui/button";
// import { FormField } from "@/src/components/ui/form-field";
// import { Input } from "@/src/components/ui/input";
// import { Textarea } from "@/src/components/ui/textarea";
// import { useAuth } from "@/src/hooks/useAuth";
// import { ROUTES } from "@/src/constants/routes";
// import { getApiErrorMessage } from "./get-error-message";
// import { useProviderRegisterMutation } from "./hooks";
// import {
//   providerRegisterSchema,
//   type ProviderRegisterFormValues,
// } from "./schema";

// export function ProviderRegisterForm() {
//   const router = useRouter();
//   const { setSession } = useAuth();
//   const registerMutation = useProviderRegisterMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ProviderRegisterFormValues>({
//     resolver: zodResolver(providerRegisterSchema),
//     defaultValues: {
//       full_name: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirm_password: "",
//       site_name: "",
//       description: "",
//       location: "",
//       contact_email: "",
//       contact_phone: "",
//     },
//   });

//   const onSubmit = async (values: ProviderRegisterFormValues) => {
//     try {
//       const response = await registerMutation.mutateAsync({
//         full_name: values.full_name,
//         email: values.email,
//         phone: values.phone || undefined,
//         password: values.password,
//         role: "provider",
//         site_name: values.site_name,
//         description: values.description,
//         location: values.location,
//         contact_email: values.contact_email || undefined,
//         contact_phone: values.contact_phone || undefined,
//       });

//       setSession(response.data.user, response.data.tokens);
//       router.push(ROUTES.providerRoot);
//     } catch {}
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="space-y-5">
//         <div>
//           <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
//             Account Details
//           </h2>
//         </div>

//         <FormField
//           label="Full Name"
//           htmlFor="provider_full_name"
//           error={errors.full_name?.message}
//         >
//           <Input
//             id="provider_full_name"
//             placeholder="Enter your full name"
//             autoComplete="name"
//             {...register("full_name")}
//           />
//         </FormField>

//         <FormField
//           label="Email Address"
//           htmlFor="provider_email"
//           error={errors.email?.message}
//         >
//           <Input
//             id="provider_email"
//             type="email"
//             placeholder="you@example.com"
//             autoComplete="email"
//             {...register("email")}
//           />
//         </FormField>

//         <FormField
//           label="Phone Number"
//           htmlFor="provider_phone"
//           hint="Optional personal phone number"
//           error={errors.phone?.message}
//         >
//           <Input
//             id="provider_phone"
//             placeholder="0700000000"
//             autoComplete="tel"
//             {...register("phone")}
//           />
//         </FormField>

//         <FormField
//           label="Password"
//           htmlFor="provider_password"
//           error={errors.password?.message}
//         >
//           <Input
//             id="provider_password"
//             type="password"
//             placeholder="Create a password"
//             autoComplete="new-password"
//             {...register("password")}
//           />
//         </FormField>

//         <FormField
//           label="Confirm Password"
//           htmlFor="provider_confirm_password"
//           error={errors.confirm_password?.message}
//         >
//           <Input
//             id="provider_confirm_password"
//             type="password"
//             placeholder="Confirm your password"
//             autoComplete="new-password"
//             {...register("confirm_password")}
//           />
//         </FormField>
//       </div>

//       <div className="space-y-5 border-t border-slate-100 pt-6">
//         <div className="space-y-1">
//           <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
//             Cultural Site Details
//           </h2>
//           <p className="text-sm text-slate-600">
//             This information will be used to create your provider profile.
//           </p>
//         </div>

//         <FormField
//           label="Cultural Site Name"
//           htmlFor="site_name"
//           error={errors.site_name?.message}
//         >
//           <Input
//             id="site_name"
//             placeholder="Kabale Heritage Tours"
//             {...register("site_name")}
//           />
//         </FormField>

//         <FormField
//           label="About Your Site"
//           htmlFor="description"
//           error={errors.description?.message}
//         >
//           <Textarea
//             id="description"
//             placeholder="Describe the cultural experiences you offer."
//             {...register("description")}
//           />
//         </FormField>

//         <FormField
//           label="Location"
//           htmlFor="location"
//           error={errors.location?.message}
//         >
//           <Input
//             id="location"
//             placeholder="Kabale, Uganda"
//             {...register("location")}
//           />
//         </FormField>

//         <FormField
//           label="Contact Email"
//           htmlFor="contact_email"
//           hint="Provide contact email or contact phone."
//           error={errors.contact_email?.message}
//         >
//           <Input
//             id="contact_email"
//             type="email"
//             placeholder="contact@example.com"
//             {...register("contact_email")}
//           />
//         </FormField>

//         <FormField
//           label="Contact Phone"
//           htmlFor="contact_phone"
//           error={errors.contact_phone?.message}
//         >
//           <Input
//             id="contact_phone"
//             placeholder="0700000000"
//             {...register("contact_phone")}
//           />
//         </FormField>
//       </div>

//       <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//         Your provider account will be created with pending verification status.
//       </div>

//       {registerMutation.isError ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {getApiErrorMessage(
//             registerMutation.error,
//             "Provider registration failed. Please try again."
//           )}
//         </div>
//       ) : null}

//       <Button type="submit" fullWidth disabled={registerMutation.isPending}>
//         {registerMutation.isPending
//           ? "Creating provider account..."
//           : "Create Provider Account"}
//       </Button>
//     </form>
//   );
// }