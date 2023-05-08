import { z } from "zod";

export function schemaParseFormData<T extends z.ZodType>(schema: T): T {
  return z.preprocess<T>(
    (x: unknown) =>
      x instanceof FormData ? Object.fromEntries(x.entries()) : x,
    schema
  ) as any;
}

export function errorField(fieldErrors: FieldErrors, fieldName: string) {
  const f = fieldErrors[fieldName];
  if (f && f.length > 0) {
    return f.join(", ");
  }
  return undefined;
}

export type FieldErrors = Record<string, string[] | undefined>;
