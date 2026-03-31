
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Globe, Compass,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { useAuth } from "@/src/hooks/useAuth";
import { useTouristRegisterMutation } from "./hooks";
import { getApiErrorMessage } from "./get-error-message";
import { touristRegisterSchema, type TouristRegisterFormValues } from "./schema";
import { ROUTES } from "@/src/constants/routes";

export function TouristRegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useTouristRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TouristRegisterFormValues>({
    resolver: zodResolver(touristRegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
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
    "w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none ring-0 transition-all focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-12">

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

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-amber-400 shadow-2xl shadow-amber-400/30">
              <Compass className="h-8 w-8 text-slate-900" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            Your cultural journey starts here
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Explore authentic experiences, follow cultural sites, and connect
            with the world's most remarkable heritage destinations.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Discover Experiences", "Follow Sites", "Book Packages", "Leave Reviews"].map((tag) => (
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Join thousands of cultural explorers worldwide
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full name */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* Password */}
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

            {/* Confirm password */}
            <FormField label="Confirm Password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
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

            {/* Error */}
            {registerMutation.isError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {getApiErrorMessage(registerMutation.error, "Registration failed. Please try again.")}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Tourist Account
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
// import { useAuth } from "@/src/hooks/useAuth";
// import { useTouristRegisterMutation } from "./hooks";
// import { getApiErrorMessage } from "./get-error-message";
// import {
//   touristRegisterSchema,
//   type TouristRegisterFormValues,
// } from "./schema";
// import { ROUTES } from "@/src/constants/routes";

// export function TouristRegisterForm() {
//   const router = useRouter();
//   const { setSession } = useAuth();
//   const registerMutation = useTouristRegisterMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<TouristRegisterFormValues>({
//     resolver: zodResolver(touristRegisterSchema),
//     defaultValues: {
//       full_name: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirm_password: "",
//     },
//   });

//   const onSubmit = async (values: TouristRegisterFormValues) => {
//     try {
//       const response = await registerMutation.mutateAsync({
//         full_name: values.full_name,
//         email: values.email,
//         phone: values.phone || undefined,
//         password: values.password,
//         role: "tourist",
//       });

//       setSession(response.data.user, response.data.tokens);
//       router.push(ROUTES.feed);
//     } catch {}
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//       <FormField
//         label="Full Name"
//         htmlFor="full_name"
//         error={errors.full_name?.message}
//       >
//         <Input
//           id="full_name"
//           placeholder="Enter your full name"
//           autoComplete="name"
//           {...register("full_name")}
//         />
//       </FormField>

//       <FormField
//         label="Email Address"
//         htmlFor="email"
//         error={errors.email?.message}
//       >
//         <Input
//           id="email"
//           type="email"
//           placeholder="you@example.com"
//           autoComplete="email"
//           {...register("email")}
//         />
//       </FormField>

//       <FormField
//         label="Phone Number"
//         htmlFor="phone"
//         hint="Optional"
//         error={errors.phone?.message}
//       >
//         <Input
//           id="phone"
//           placeholder="0700000000"
//           autoComplete="tel"
//           {...register("phone")}
//         />
//       </FormField>

//       <FormField
//         label="Password"
//         htmlFor="password"
//         error={errors.password?.message}
//       >
//         <Input
//           id="password"
//           type="password"
//           placeholder="Create a password"
//           autoComplete="new-password"
//           {...register("password")}
//         />
//       </FormField>

//       <FormField
//         label="Confirm Password"
//         htmlFor="confirm_password"
//         error={errors.confirm_password?.message}
//       >
//         <Input
//           id="confirm_password"
//           type="password"
//           placeholder="Confirm your password"
//           autoComplete="new-password"
//           {...register("confirm_password")}
//         />
//       </FormField>

//       {registerMutation.isError ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {getApiErrorMessage(
//             registerMutation.error,
//             "Registration failed. Please try again."
//           )}
//         </div>
//       ) : null}

//       <Button type="submit" fullWidth disabled={registerMutation.isPending}>
//         {registerMutation.isPending ? "Creating account..." : "Create Tourist Account"}
//       </Button>
//     </form>
//   );
// }