"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { createEmptyFormValues } from "./form.utils";

import type { AppFormOptions, AppFormSchema, AppFormValues } from "./form.types";

export const useAppForm = <TSchema extends AppFormSchema>(
  schema: TSchema,
  options?: AppFormOptions<TSchema>,
): Pick<
  UseFormReturn<AppFormValues<TSchema>>,
  "register" | "handleSubmit" | "formState" | "watch" | "setValue" | "reset"
> => {
  const form = useForm<AppFormValues<TSchema>>({
    ...options,
    defaultValues: options?.defaultValues ?? createEmptyFormValues<TSchema>(),
    resolver: zodResolver(schema),
  });

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    reset: form.reset,
  };
};
