import * as z from "zod";
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export default formSchema;
