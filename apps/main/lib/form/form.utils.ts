import type { AppFormSchema, AppFormValues } from "./form.types";

export const createEmptyFormValues = <TSchema extends AppFormSchema>():
  | AppFormValues<TSchema>
  | undefined => undefined;
