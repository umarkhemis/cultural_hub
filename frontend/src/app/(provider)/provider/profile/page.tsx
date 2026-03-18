

"use client";

import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { MediaUploadField } from "@/src/components/ui/media-upload-field";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useMyProviderSite, useUpdateMyProviderSiteMutation } from "@/src/features/provider/site-hooks";
import { useToastStore } from "@/src/store/toast-store";

export default function ProviderProfilePage() {
  const { data, isLoading, isError } = useMyProviderSite();
  const updateMutation = useUpdateMyProviderSiteMutation();
  const { addToast } = useToastStore();

  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (data) {
      setSiteName(data.site_name || "");
      setDescription(data.description || "");
      setLocation(data.location || "");
      setContactEmail(data.contact_email || "");
      setContactPhone(data.contact_phone || "");
      setLogoUrl(data.logo_url || "");
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        site_name: siteName,
        description,
        location,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        logo_url: logoUrl || undefined,
      });

      addToast({
        type: "success",
        title: "Profile updated",
        description: "Your cultural site details were saved successfully.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Update failed",
        description: "We could not save your profile changes.",
      });
    }
  };

  if (isLoading) {
    return <LoadingState label="Loading provider profile..." />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        We could not load your provider profile right now.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Provider Profile
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Update your cultural site identity, contact details, and logo.
        </p>

        <div className="mt-8 space-y-5">
          <MediaUploadField
            label="Logo"
            accept="image/*"
            previewUrl={logoUrl || null}
            onUploaded={({ mediaUrl }) => setLogoUrl(mediaUrl)}
          />

          <FormField label="Cultural Site Name" htmlFor="site_name">
            <Input
              id="site_name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </FormField>

          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <FormField label="Location" htmlFor="location">
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Contact Email" htmlFor="contact_email">
              <Input
                id="contact_email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Contact Phone" htmlFor="contact_phone">
              <Input
                id="contact_phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </FormField>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Verification status:{" "}
            <span className="font-medium capitalize text-slate-900">
              {data.verification_status}
            </span>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}




































































// "use client";

// import { useAuth } from "@/src/hooks/useAuth";

// export default function ProviderProfilePage() {
//   const { user } = useAuth();

//   return (
//     <div className="space-y-6">
//       <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//         <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
//           <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-100 text-xl font-semibold text-slate-700">
//             {user?.full_name?.slice(0, 2).toUpperCase() || "PR"}
//           </div>

//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//               Provider Profile
//             </h1>
//             <p className="mt-2 text-sm leading-6 text-slate-600">
//               Review account details and prepare for site profile management.
//             </p>
//           </div>
//         </div>

//         <div className="mt-8 grid gap-4 sm:grid-cols-2">
//           <div className="rounded-2xl bg-slate-50 p-4">
//             <p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p>
//             <p className="mt-2 text-sm font-medium text-slate-900">
//               {user?.full_name || "—"}
//             </p>
//           </div>

//           <div className="rounded-2xl bg-slate-50 p-4">
//             <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
//             <p className="mt-2 text-sm font-medium text-slate-900">
//               {user?.email || "—"}
//             </p>
//           </div>

//           <div className="rounded-2xl bg-slate-50 p-4">
//             <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
//             <p className="mt-2 text-sm font-medium text-slate-900">
//               {user?.phone || "Not provided"}
//             </p>
//           </div>

//           <div className="rounded-2xl bg-slate-50 p-4">
//             <p className="text-xs uppercase tracking-wide text-slate-500">Verification</p>
//             <p className="mt-2 text-sm font-medium text-slate-900">
//               Pending profile integration
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-slate-900">Coming next</h2>
//         <p className="mt-2 text-sm leading-6 text-slate-600">
//           This screen can later support editing cultural site details, logo upload,
//           verification workflow, and provider identity settings.
//         </p>
//       </div>
//     </div>
//   );
// }