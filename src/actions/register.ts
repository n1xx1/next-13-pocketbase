import { schemaParseFormData } from "@/lib/utils";
import PocketBase, { ClientResponseError } from "pocketbase";
import { z } from "zod";

export type RegisterAction = (data: FormData) => Promise<RegisterActionResult>;

type RegisterActionResultOk = { ok: true };

type RegisterActionResultError = {
  ok: false;
  error?: ClientResponseError;
} & Partial<z.inferFlattenedErrors<typeof registerFormSchema>>;

export type RegisterActionResult =
  | RegisterActionResultOk
  | RegisterActionResultError;

export async function registerAction(
  pb: PocketBase,
  data: FormData
): Promise<RegisterActionResult> {
  const parsed = registerFormSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, ...parsed.error.formErrors };
  }

  try {
    await pb.collection("users").create({
      username: parsed.data.username,
      email: parsed.data.email,
      emailVisibility: false,
      password: parsed.data.password,
      passwordConfirm: parsed.data.passwordConfirm,
    });

    await pb.collection("users").requestVerification(parsed.data.email);

    await pb
      .collection("users")
      .authWithPassword(parsed.data.email, parsed.data.username);

    return { ok: true };
  } catch (e) {
    if (e instanceof ClientResponseError) {
      return { ok: false, error: e.toJSON() };
    }
    throw e;
  }
}

const registerFormSchema = schemaParseFormData(
  z
    .object({
      username: z
        .string()
        .min(3, "Username should be at least 3 characters long"),
      email: z.string().email().min(3),
      password: z
        .string()
        .min(8, "Password should be at least 8 characters long"),
      passwordConfirm: z.string(),
    })
    .superRefine((val, ctx) => {
      if (val.passwordConfirm !== val.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The two passwords should match.",
          path: ["passwordConfirm"],
        });
      }
    })
);
