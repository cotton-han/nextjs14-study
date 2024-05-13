"use server";

import { login } from "@/lib/auth";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const schema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Username is required!",
      })
      .trim()
      .toLowerCase(),
    // .transform((username) => `👽 ${username}`)
    // .refine((username) => !username.includes("potato"), "No potatoes!"),
    // .refine(checkUniqueUsername, "Username already exists!"),
    email: z.string().email().toLowerCase(),
    // .refine(checkUniqueEmail, "Email already exists!"),
    password: z
      .string({
        required_error: "Password is required!",
      })
      .min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = await schema.spa(data); // safeParseAsync 약어

  if (!result.success) return result.error.flatten();

  const { username, email, password } = result.data;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: { id: true },
  });

  await login(user.id);
}
