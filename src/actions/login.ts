import { schemaParseFormData } from "@/lib/utils";
import PocketBase, { ClientResponseError } from "pocketbase";
import { z } from "zod";

export type LoginAction = (data: FormData) => Promise<LoginActionResult>;

type LoginActionResultOk = { ok: true };

type LoginActionResultError = {
  ok: false;
  error?: ClientResponseError;
} & Partial<z.inferFlattenedErrors<typeof loginFormSchema>>;

export type LoginActionResult = LoginActionResultOk | LoginActionResultError;

export async function loginAction(
  pb: PocketBase,
  data: FormData
): Promise<LoginActionResult> {
  const parsed = loginFormSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, ...parsed.error.formErrors };
  }

  try {
    await pb
      .collection("users")
      .authWithPassword(parsed.data.email, parsed.data.password);

    return { ok: true };
  } catch (e) {
    if (e instanceof ClientResponseError) {
      return { ok: false, error: e.toJSON() };
    }
    throw e;
  }
}

const loginFormSchema = schemaParseFormData(
  z.object({
    email: z.string().email().min(1),
    password: z.string().min(1),
    remember_me: z.coerce.boolean(),
  })
);
