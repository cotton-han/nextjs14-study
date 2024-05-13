"use server";

import { login } from "@/lib/auth";
import bcrypt from "bcrypt";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return Boolean(user);
};

const schema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "User not found"),
  password: z
    .string({
      required_error: "Password is required!",
    })
    .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function loginWithValidation(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await schema.spa(data);

  if (!result.success) return result.error.flatten();

  const { email, password } = result.data;

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user!.password ?? ""
  );

  if (!isPasswordCorrect) {
    return {
      fieldErrors: { password: ["Password is incorrect"], email: [] },
    };
  }

  await login(user!.id);
}
