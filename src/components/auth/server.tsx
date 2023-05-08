import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, headers } from "next/headers";
import { ReactNode, cache } from "react";
import { ClientAuthProvider } from "./client";
import { createPocketBase, nextSavePocketBaseCookie } from "./server-base";

export const getServerPocketBase = cache(getServerPocketBaseUncached);

export function getServerPocketBaseUncached(saveCookieOnAuthChange?: boolean) {
  const pb = createPocketBase(headers().get("cookie") ?? "");

  if (saveCookieOnAuthChange) {
    const cookieStore = cookies() as RequestCookies;
    pb.authStore.onChange(() => {
      // NOTE: it's fine in Server Actions
      nextSavePocketBaseCookie(pb, cookieStore as any as ResponseCookies);
    });
  }

  return pb;
}

export const ServerAuthProvider = ({ children }: { children: ReactNode }) => {
  const pb = getServerPocketBase();
  return (
    <ClientAuthProvider
      data={
        pb.authStore.isValid
          ? {
              token: pb.authStore.token,
              model: pb.authStore.model?.$export() ?? null,
            }
          : null
      }
    >
      {children}
    </ClientAuthProvider>
  );
};
