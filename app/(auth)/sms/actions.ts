"use server";

import { login } from "@/lib/auth";
import { SMS_CODE_MAX, SMS_CODE_MIN } from "@/lib/constants";
import db from "@/lib/db";
import crypto from "crypto";
import twilio from "twilio";
import validator from "validator";
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phoneNumber) => validator.isMobilePhone(phoneNumber, "ko-KR"),
    "Wrong phone format"
  );

async function codeExists(code: number) {
  const exists = await db.sMSCode.findUnique({
    where: { code: code.toString() },
    select: { id: true },
  });
  return Boolean(exists);
}

const codeSchema = z.coerce
  .number()
  .min(SMS_CODE_MIN)
  .max(SMS_CODE_MAX)
  .refine(codeExists, "Wrong code");

async function getCode() {
  const code = crypto.randomInt(SMS_CODE_MIN, SMS_CODE_MAX).toString();
  const exists = await db.sMSCode.findUnique({
    where: { code },
  });
  if (exists) return getCode();
  else return code;
}

interface ActionState {
  code: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  if (!prevState.code) {
    const result = phoneSchema.safeParse(formData.get("phone"));
    if (!result.success) {
      return {
        code: false,
        error: result.error.flatten(),
      };
    } else {
      const phone = result.data;
      await db.sMSCode.deleteMany({ where: { user: { phone } } });
      const code = await getCode();
      await db.sMSCode.create({
        data: {
          code,
          user: {
            connectOrCreate: {
              where: { phone },
              create: {
                phone,
                username: crypto.randomBytes(10).toString("hex"),
              },
            },
          },
        },
      });

      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your karrot-market verification code is ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER!, // for testing
      });

      return {
        code: true,
      };
    }
  } else {
    const result = await codeSchema.spa(formData.get("code"));
    if (!result.success) {
      return {
        code: true,
        error: result.error.flatten(),
      };
    } else {
      const code = await db.sMSCode.findUnique({
        where: { code: result.data.toString() },
        select: { id: true, userId: true },
      });
      await db.sMSCode.delete({ where: { id: code!.id } });

      return await login(code!.userId);
    }
  }
}
