import z from "zod";

export const UserRegisterFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." })
    .max(50, { message: "Full name must not exceed 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(2, { message: "Email must be at least 2 characters long." })
    .max(50, { message: "Email must not exceed 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(50, { message: "Password must not exceed 50 characters." }),
});

export const UpdateUserAccountFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." })
    .max(50, { message: "Full name must not exceed 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(2, { message: "Email must be at least 2 characters long." })
    .max(50, { message: "Email must not exceed 50 characters." }),
});

export const UserLoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(2, { message: "Email must be at least 2 characters long." })
    .max(50, { message: "Email must not exceed 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(50, { message: "Password must not exceed 50 characters." }),
});

export const FoodPartnerLoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(2, { message: "Email must be at least 2 characters long." })
    .max(50, { message: "Email must not exceed 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(50, { message: "Password must not exceed 50 characters." }),
});

export const FoodPartnerRegisterFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." })
    .max(50, { message: "Full name must not exceed 50 characters." }),
  contactName: z
    .string()
    .min(2, { message: "Contact name must be at least 2 characters long." })
    .max(50, { message: "Contact name must not exceed 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(2, { message: "Email must be at least 2 characters long." })
    .max(50, { message: "Email must not exceed 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(50, { message: "Password must not exceed 50 characters." }),
  address: z
    .string()
    .min(3, { message: "Adress must be at least 6 characters long." }),
  phone: z
    .string()
    .min(6, { message: "Phone no must be at least 10 characters long." })
    .max(50, { message: "Phone must not exceed 12 characters." }),
});

export type UserRegisterFormData = z.infer<typeof UserRegisterFormSchema>;
export type UserLoginFormData = z.infer<typeof UserLoginFormSchema>;
export type UpdateUserAccountFormData = z.infer<typeof UpdateUserAccountFormSchema>;
export type FoodPartnerLoginFormData = z.infer<
  typeof FoodPartnerLoginFormSchema
>;
export type FoodPartnerRegisterFormData = z.infer<
  typeof FoodPartnerRegisterFormSchema
>;
