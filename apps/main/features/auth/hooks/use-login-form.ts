"use client";

import { useToast } from "@gradlly/hooks";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent, useCallback } from "react";

import { useSignIn } from "../queries";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { useAppForm } from "@/lib/form";


interface UseLoginFormResult {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
}

export const useLoginForm = (): UseLoginFormResult => {
  const router = useRouter();
  const toast = useToast();
  const { signInAsync, isPending } = useSignIn();

  const { register, handleSubmit, formState } = useAppForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const submit = useCallback(
    async (values: LoginFormValues): Promise<void> => {
      try {
        await signInAsync(values);
        toast.success("Signed in successfully.");
        router.push("/docs");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to sign in.";
        toast.error(message);
      }
    },
    [router, signInAsync, toast],
  );

  return {
    register,
    errors: formState.errors,
    onSubmit: handleSubmit(submit),
    loading: isPending,
  };
};
