import z from "zod";

export const loginSchemaForm = z.object({
  email: z.email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// export const createUserSchema = z.object({
//   email: z.email("Please enter a valid email").min(1, "Email is required"),
//   password: z.string().min(1, "Password is required"),
//   name: z.string().min(1, "Name is required"),
//   role: z.string().min(1, "Role is Required"),
//   avatar_url: z.union([
//     z.string().min(1, "Image Url is required"),
//     z.instanceof(File),
//   ]),
// });

export type LoginForm = z.infer<typeof loginSchemaForm>;
// export type CreateUserForm = z.infer<typeof createUserSchema>;
