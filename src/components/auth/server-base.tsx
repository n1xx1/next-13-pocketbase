import { env } from "@/env.mjs";
import { MemoryAuthStore } from "@/lib/memory-auth-store";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import PocketBase, { getTokenPayload } from "pocketbase";

export function nextSavePocketBaseCookie(
  pb: PocketBase,
  cookieStore: ResponseCookies | RequestCookies
) {
  const payload = getTokenPayload(pb.authStore.token);
  cookieStore.set({
    name: "pb_auth",
    value: JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.model?.$export() ?? null,
    }),
    expires: payload?.exp
      ? new Date(payload.exp * 1000)
      : new Date("1970-01-01"),
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

export function createPocketBase(cookieHeader?: string | RequestCookies) {
  const pb = new PocketBase(env.POCKETBASE_URL, new MemoryAuthStore());
  if (typeof cookieHeader === "string") {
    pb.authStore.loadFromCookie(cookieHeader);
  } else if (cookieHeader instanceof RequestCookies) {
    pbLoadFromRequestCookies(pb, cookieHeader);
  }

  return pb;
}

export function pbLoadFromRequestCookies(
  pb: PocketBase,
  cookies: RequestCookies
) {
  const rawData = cookies.get("pb_auth")?.value ?? "";
  let data: Record<string, any> = {};
  try {
    data = JSON.parse(rawData);
    if (
      typeof data === null ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      data = {};
    }
  } catch (e) {}

  pb.authStore.save(data.token ?? "", data.model ?? null);
}
