import { ReactNode } from "react";
import { StylesProvider } from "@/components/styles-provider";
import { MainLayout } from "@/components/layouts/main";
import { ServerAuthProvider } from "@/components/auth/server";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head />
      <body>
        <ServerAuthProvider>
          <StylesProvider>
            <MainLayout>{children}</MainLayout>
          </StylesProvider>
        </ServerAuthProvider>
      </body>
    </html>
  );
}
