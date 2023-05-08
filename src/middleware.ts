import {
  createPocketBase,
  nextSavePocketBaseCookie,
} from "@/components/auth/server-base";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pb = createPocketBase(request.cookies);

  pb.authStore.onChange(() => {
    nextSavePocketBaseCookie(pb, request.cookies);
    nextSavePocketBaseCookie(pb, response.cookies);
  });

  if (pb.authStore.isValid) {
    try {
      await pb.collection("users").authRefresh();
    } catch (_) {
      pb.authStore.clear();
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
