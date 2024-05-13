"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { SMS_CODE_MAX, SMS_CODE_MIN } from "@/lib/constants";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

const initialState = {
  code: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Log in</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        {state.code ? (
          <Input
            name="code"
            type="number"
            placeholder="Verification code"
            required
            min={SMS_CODE_MIN}
            max={SMS_CODE_MAX}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.code ? "Verify code" : "Send verification SMS"} />
      </form>
    </div>
  );
}
