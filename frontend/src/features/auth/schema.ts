
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const touristRegisterSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export const providerRegisterSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
    site_name: z.string().min(2, "Cultural site name is required."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters."),
    location: z.string().min(2, "Location is required."),
    contact_email: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
        message: "Enter a valid contact email address.",
      }),
    contact_phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })
  .refine(
    (data) => Boolean(data.contact_email?.trim() || data.contact_phone?.trim()),
    {
      message: "Provide contact email or contact phone.",
      path: ["contact_email"],
    }
  );

export type LoginFormValues = z.infer<typeof loginSchema>;
export type TouristRegisterFormValues = z.infer<typeof touristRegisterSchema>;
export type ProviderRegisterFormValues = z.infer<typeof providerRegisterSchema>;