import z from "zod";

export const signInScheme = z
  .object({
    email: z.string().max(90).email(),
    password: z.string().max(40).min(9),
  })
  .required();

export const signUpScheme = signInScheme
  .merge(
    z.object({
      username: z.string().min(3).max(30),
    }),
  )
  .required();
