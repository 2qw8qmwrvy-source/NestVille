import * as z from "zod";

export const NEIGHBORHOODS = [
  "Downtown Wolfville",
  "University Avenue",
  "Highland Avenue",
  "Main Street",
  "Gaspereau Avenue",
  "Prospect Street",
  "Acadia Street",
  "Front Street",
  "Other",
] as const;

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Townhouse",
  "Room in shared house",
  "Basement suite",
  "Other",
] as const;

export const LEASE_LENGTHS = [
  "12 months",
  "8 months (school year)",
  "4 months (summer sublet)",
  "Month-to-month",
] as const;

export const ROOMMATE_TYPES = [
  { value: "have_room", label: "I have a room / lease to offer" },
  { value: "need_room", label: "I'm looking for a room or roommate" },
] as const;

export const SignupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

const optionalUrl = z.union([z.url("Enter a valid image URL."), z.literal("")]);

export const ListingSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(120),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(4000),
  address: z.string().trim().min(3, "Address is required."),
  neighborhood: z.string().trim().optional(),
  price: z.coerce.number().int().positive("Price must be a positive number."),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().min(0.5).max(20),
  propertyType: z.string().trim().min(1, "Select a property type."),
  availableFrom: z.string().trim().min(1, "Select an availability date."),
  leaseLength: z.string().trim().optional(),
  furnished: z.coerce.boolean().optional(),
  petsAllowed: z.coerce.boolean().optional(),
  utilitiesIncluded: z.coerce.boolean().optional(),
  parking: z.coerce.boolean().optional(),
  laundry: z.coerce.boolean().optional(),
  images: z
    .array(optionalUrl)
    .max(8, "You can add up to 8 images.")
    .optional(),
});

export const RoommatePostSchema = z.object({
  type: z.enum(["have_room", "need_room"]),
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(120),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(4000),
  price: z
    .union([z.coerce.number().int().positive(), z.nan()])
    .optional()
    .transform((v) => (v === undefined || Number.isNaN(v) ? undefined : v)),
  location: z.string().trim().optional(),
  moveInDate: z.string().trim().optional(),
  moveOutDate: z.string().trim().optional(),
});
