
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/hooks/useAuth";
import { useTouristRegisterMutation } from "./hooks";
import { getApiErrorMessage } from "./get-error-message";
import {
  touristRegisterSchema,
  type TouristRegisterFormValues,
} from "./schema";
import { ROUTES } from "@/src/constants/routes";

export function TouristRegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useTouristRegisterMutation();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        label="Full Name"
        htmlFor="full_name"
        error={errors.full_name?.message}
      >
        <Input
          id="full_name"
          placeholder="Enter your full name"
          autoComplete="name"
          {...register("full_name")}
        />
      </FormField>

      <FormField
        label="Email Address"
        htmlFor="email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Phone Number"
        htmlFor="phone"
        hint="Optional"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          placeholder="0700000000"
          autoComplete="tel"
          {...register("phone")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor="confirm_password"
        error={errors.confirm_password?.message}
      >
        <Input
          id="confirm_password"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          {...register("confirm_password")}
        />
      </FormField>

      {registerMutation.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(
            registerMutation.error,
            "Registration failed. Please try again."
          )}
        </div>
      ) : null}

      <Button type="submit" fullWidth disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Creating account..." : "Create Tourist Account"}
      </Button>
    </form>
  );
}