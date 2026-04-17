
// // src/app/(auth)/register/provider-complete/page.tsx
// "use client";

// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { MapPin, Building2, FileText, AtSign, Phone, ArrowRight, Sparkles } from "lucide-react";
// import { z } from "zod";

// import { FormField } from "@/src/components/ui/form-field";
// import { BrandLogo } from "@/src/components/common/brand-logo";
// import { ROUTES } from "@/src/constants/routes";
// import { useUpdateMyProviderSiteMutation } from "@/src/features/provider/site-hooks";

// const siteDetailsSchema = z.object({
//   site_name: z.string().min(2, "Site name is required"),
//   location: z.string().min(2, "Location is required"),
//   description: z.string().min(10, "Please describe your site (min 10 characters)"),
//   contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
//   contact_phone: z.string().optional(),
// });

// type SiteDetailsValues = z.infer<typeof siteDetailsSchema>;

// export default function ProviderCompletePage() {
//   const router = useRouter();
//   const updateSite = useUpdateMyProviderSiteMutation();

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<SiteDetailsValues>({
//     resolver: zodResolver(siteDetailsSchema),
//     defaultValues: {
//       site_name: "",
//       location: "",
//       description: "",
//       contact_email: "",
//       contact_phone: "",
//     },
//   });

//   const onSubmit = async (values: SiteDetailsValues) => {
//     try {
//       await updateSite.mutateAsync({
//         site_name: values.site_name,
//         location: values.location,
//         description: values.description,
//         contact_email: values.contact_email || undefined,
//         contact_phone: values.contact_phone || undefined,
//       });
//       router.push(ROUTES.providerRoot);
//     } catch {
//       setError("root", { message: "Failed to save site details. Please try again." });
//     }
//   };

//   const inputClass =
//     "w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm";

//   const iconClass =
//     "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4";

//   return (
//     <div className="relative min-h-screen w-full">
//       {/* Background */}
//       <div className="fixed inset-0 z-0">
//         <img
//           src="/mock/kigezi_mountain.jpg"
//           alt="Cultural landscape"
//           className="h-full w-full object-cover"
//         />
//         <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
//         <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 flex min-h-screen flex-col items-center px-3 py-0 sm:px-6">

//         {/* Top bar */}
//         <div className="flex w-full max-w-2xl items-center py-4 sm:py-5">
//           <BrandLogo size="sm" showTagline={false} />
//         </div>

//         {/* Heading */}
//         <div className="mb-5 w-full max-w-2xl sm:mb-8">
//           <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 mb-2.5 sm:gap-2 sm:px-3 sm:py-1.5 sm:mb-4">
//             <Sparkles className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5" />
//             <span className="text-[10px] font-semibold text-amber-400 sm:text-xs">One more step</span>
//           </div>
//           <h1 className="text-xl font-bold tracking-tight text-white leading-tight sm:text-3xl lg:text-4xl">
//             Tell us about your cultural site
//           </h1>
//           <p className="mt-1 text-xs text-slate-300 max-w-md leading-5 sm:mt-2 sm:text-sm sm:leading-6">
//             Your Google account is connected. Now add your site details so tourists can find you.
//           </p>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="w-full max-w-2xl space-y-4 pb-8 sm:space-y-6"
//         >
//           {/* Site name + Location */}
//           <div className="grid grid-cols-2 gap-2 sm:gap-4">
//             <FormField label="Site Name" htmlFor="site_name" error={errors.site_name?.message}>
//               <div className="relative">
//                 <Building2 className={iconClass} />
//                 <input
//                   id="site_name"
//                   placeholder="Kabale Heritage Tours"
//                   className={inputClass}
//                   {...register("site_name")}
//                 />
//               </div>
//             </FormField>

//             <FormField label="Location" htmlFor="location" error={errors.location?.message}>
//               <div className="relative">
//                 <MapPin className={iconClass} />
//                 <input
//                   id="location"
//                   placeholder="Kabale, Uganda"
//                   className={inputClass}
//                   {...register("location")}
//                 />
//               </div>
//             </FormField>
//           </div>

//           {/* Description */}
//           <FormField label="About Your Site" htmlFor="description" error={errors.description?.message}>
//             <div className="relative">
//               <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:top-3.5 sm:h-4 sm:w-4" />
//               <textarea
//                 id="description"
//                 placeholder="Describe the cultural experiences you offer to visitors..."
//                 rows={3}
//                 className="w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 resize-none sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm"
//                 {...register("description")}
//               />
//             </div>
//           </FormField>

//           {/* Contact info */}
//           <div className="grid grid-cols-2 gap-2 sm:gap-4">
//             <FormField
//               label="Contact Email (optional)"
//               htmlFor="contact_email"
//               error={errors.contact_email?.message}
//             >
//               <div className="relative">
//                 <AtSign className={iconClass} />
//                 <input
//                   id="contact_email"
//                   type="email"
//                   placeholder="contact@yoursite.com"
//                   className={inputClass}
//                   {...register("contact_email")}
//                 />
//               </div>
//             </FormField>

//             <FormField
//               label="Contact Phone (optional)"
//               htmlFor="contact_phone"
//               error={errors.contact_phone?.message}
//             >
//               <div className="relative">
//                 <Phone className={iconClass} />
//                 <input
//                   id="contact_phone"
//                   placeholder="0700000000"
//                   inputMode="tel"
//                   className={inputClass}
//                   {...register("contact_phone")}
//                 />
//               </div>
//             </FormField>
//           </div>

//           {/* Root/server error */}
//           {errors.root && (
//             <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
//               {errors.root.message}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isSubmitting || updateSite.isPending}
//             className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed sm:rounded-2xl sm:py-4"
//           >
//             {(isSubmitting || updateSite.isPending) ? (
//               <>
//                 <span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 Finish Setup
//                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }





































// src/app/(auth)/register/provider-complete/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Building2, FileText, AtSign, Phone, ArrowRight, Sparkles } from "lucide-react";
import { z } from "zod";

import { FormField } from "@/src/components/ui/form-field";
import { BrandLogo } from "@/src/components/common/brand-logo";
import { ROUTES } from "@/src/constants/routes";
import { useAuthStore } from "@/src/store/auth-store";

const siteDetailsSchema = z.object({
  site_name: z.string().min(2, "Site name is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Please describe your site (min 10 characters)"),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
});

type SiteDetailsValues = z.infer<typeof siteDetailsSchema>;

export default function ProviderCompletePage() {
  const router = useRouter();
  const { tokens } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SiteDetailsValues>({
    resolver: zodResolver(siteDetailsSchema),
    defaultValues: {
      site_name: "",
      location: "",
      description: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  const onSubmit = async (values: SiteDetailsValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/site-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens?.access_token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = body?.message || "Failed to save site details. Please try again.";
        setError("root", { message });
        return;
      }

      router.push(ROUTES.providerRoot);
    } catch {
      setError("root", { message: "Something went wrong. Please check your connection." });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/25 bg-white/15 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400/60 focus:bg-white/20 focus:ring-2 focus:ring-amber-400/20 sm:rounded-2xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm";

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none sm:left-3.5 sm:h-4 sm:w-4";

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-3 py-0 sm:px-6">

        {/* Top bar */}
        <div className="flex w-full max-w-2xl items-center py-4 sm:py-5">
          <BrandLogo size="sm" showTagline={false} />
        </div>

        {/* Heading */}
        <div className="mb-5 w-full max-w-2xl sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 mb-2.5 sm:gap-2 sm:px-3 sm:py-1.5 sm:mb-4">
            <Sparkles className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] font-semibold text-amber-400 sm:text-xs">One more step</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight sm:text-3xl lg:text-4xl">
            Tell us about your cultural site
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-md leading-5 sm:mt-2 sm:text-sm sm:leading-6">
            Your Google account is connected. Now add your site details so tourists can find you.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-4 pb-8 sm:space-y-6"
        >
          {/* Site name + Location */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <FormField label="Site Name" htmlFor="site_name" error={errors.site_name?.message}>
              <div className="relative">
                <Building2 className={iconClass} />
                <input
                  id="site_name"
                  placeholder="Kabale Heritage Tours"
                  className={inputClass}
                  {...register("site_name")}
                />
              </div>
            </FormField>

            <FormField label="Location" htmlFor="location" error={errors.location?.message}>
              <div className="relative">
                <MapPin className={iconClass} />
                <input
                  id="location"
                  placeholder="Kabale, Uganda"
                  className={inputClass}
                  {...register("location")}
                />
              </div>
            </FormField>
          </div>

          {/* Description */}
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

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <FormField
              label="Contact Email (optional)"
              htmlFor="contact_email"
              error={errors.contact_email?.message}
            >
              <div className="relative">
                <AtSign className={iconClass} />
                <input
                  id="contact_email"
                  type="email"
                  placeholder="contact@yoursite.com"
                  className={inputClass}
                  {...register("contact_email")}
                />
              </div>
            </FormField>

            <FormField
              label="Contact Phone (optional)"
              htmlFor="contact_phone"
              error={errors.contact_phone?.message}
            >
              <div className="relative">
                <Phone className={iconClass} />
                <input
                  id="contact_phone"
                  placeholder="0700000000"
                  inputMode="tel"
                  className={inputClass}
                  {...register("contact_phone")}
                />
              </div>
            </FormField>
          </div>

          {/* Root/server error */}
          {errors.root && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed sm:rounded-2xl sm:py-4"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Finish Setup
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}



