import type { DefaultValues, UseFormProps } from "react-hook-form";
import type { z, ZodTypeAny } from "zod";

export type AppFormSchema = ZodTypeAny;

export type AppFormValues<TSchema extends AppFormSchema> = z.infer<TSchema>;

export type AppFormOptions<TSchema extends AppFormSchema> = Omit<
  UseFormProps<AppFormValues<TSchema>>,
  "resolver"
> & {
  defaultValues?: DefaultValues<AppFormValues<TSchema>>;
};
