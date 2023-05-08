"use client";

import { env } from "@/env.mjs";
import { MemoryAuthStore } from "@/lib/memory-auth-store";
import PocketBase from "pocketbase";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const ClientAuthContext = createContext<null | { pb: PocketBase }>(null);

export type ClientAuthProviderProps = {
  data: { token: string; model: any } | null;
  children?: ReactNode;
};

export const ClientAuthProvider = ({
  data,
  children,
}: ClientAuthProviderProps) => {
  const [ctx] = useState(() => {
    const pb = new PocketBase(
      env.NEXT_PUBLIC_POCKETBASE_URL,
      new MemoryAuthStore()
    );
    if (data) {
      pb.authStore.save(data.token, data.model);
    }
    return { pb };
  });

  useEffect(() => {
    if (data) {
      ctx.pb.authStore.save(data.token, data.model);
    } else {
      ctx.pb.authStore.clear();
    }
  }, [data]);

  return (
    <ClientAuthContext.Provider value={ctx}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export function usePocketBase() {
  const ctx = useContext(ClientAuthContext);
  if (!ctx) {
    throw new Error("usePocketBase can't be used outside a ClientAuthContext");
  }
  return ctx.pb;
}
