
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { getApiErrorMessage } from "./get-error-message";
import { useProviderRegisterMutation } from "./hooks";
import {
  providerRegisterSchema,
  type ProviderRegisterFormValues,
} from "./schema";

export function ProviderRegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useProviderRegisterMutation();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Account Details
          </h2>
        </div>

        <FormField
          label="Full Name"
          htmlFor="provider_full_name"
          error={errors.full_name?.message}
        >
          <Input
            id="provider_full_name"
            placeholder="Enter your full name"
            autoComplete="name"
            {...register("full_name")}
          />
        </FormField>

        <FormField
          label="Email Address"
          htmlFor="provider_email"
          error={errors.email?.message}
        >
          <Input
            id="provider_email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Phone Number"
          htmlFor="provider_phone"
          hint="Optional personal phone number"
          error={errors.phone?.message}
        >
          <Input
            id="provider_phone"
            placeholder="0700000000"
            autoComplete="tel"
            {...register("phone")}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="provider_password"
          error={errors.password?.message}
        >
          <Input
            id="provider_password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="provider_confirm_password"
          error={errors.confirm_password?.message}
        >
          <Input
            id="provider_confirm_password"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            {...register("confirm_password")}
          />
        </FormField>
      </div>

      <div className="space-y-5 border-t border-slate-100 pt-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cultural Site Details
          </h2>
          <p className="text-sm text-slate-600">
            This information will be used to create your provider profile.
          </p>
        </div>

        <FormField
          label="Cultural Site Name"
          htmlFor="site_name"
          error={errors.site_name?.message}
        >
          <Input
            id="site_name"
            placeholder="Kabale Heritage Tours"
            {...register("site_name")}
          />
        </FormField>

        <FormField
          label="About Your Site"
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            placeholder="Describe the cultural experiences you offer."
            {...register("description")}
          />
        </FormField>

        <FormField
          label="Location"
          htmlFor="location"
          error={errors.location?.message}
        >
          <Input
            id="location"
            placeholder="Kabale, Uganda"
            {...register("location")}
          />
        </FormField>

        <FormField
          label="Contact Email"
          htmlFor="contact_email"
          hint="Provide contact email or contact phone."
          error={errors.contact_email?.message}
        >
          <Input
            id="contact_email"
            type="email"
            placeholder="contact@example.com"
            {...register("contact_email")}
          />
        </FormField>

        <FormField
          label="Contact Phone"
          htmlFor="contact_phone"
          error={errors.contact_phone?.message}
        >
          <Input
            id="contact_phone"
            placeholder="0700000000"
            {...register("contact_phone")}
          />
        </FormField>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Your provider account will be created with pending verification status.
      </div>

      {registerMutation.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(
            registerMutation.error,
            "Provider registration failed. Please try again."
          )}
        </div>
      ) : null}

      <Button type="submit" fullWidth disabled={registerMutation.isPending}>
        {registerMutation.isPending
          ? "Creating provider account..."
          : "Create Provider Account"}
      </Button>
    </form>
  );
}