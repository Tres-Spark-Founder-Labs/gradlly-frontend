import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(200, "Workspace name must be 200 characters or fewer"),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(10, "Postcode must be 10 characters or fewer")
    .transform((v) => v.toUpperCase()),
  country: z.string().min(1, "Country is required"),
  ukprn: z.string().regex(/^\d{8}$/, "UKPRN must be exactly 8 digits"),
  orgEmail: z.string().email("Enter a valid email address"),
  orgPhone: z.string().max(20).optional().or(z.literal("")),
  website: z
    .string()
    .url("Enter a valid URL (including https://)")
    .optional()
    .or(z.literal("")),
});

export const createOrganizationDefaults = {
  name: "",
  address: "",
  city: "",
  postcode: "",
  country: "GB",
  ukprn: "",
  orgEmail: "",
  orgPhone: "",
  website: "",
};
