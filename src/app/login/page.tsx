import { loginAction } from "@/actions/login";
import { getServerPocketBase } from "@/components/auth/server";
import { LoginPage } from "@/components/pages/login";

export default function Page() {
  return <LoginPage loginAction={serverLoginAction} />;
}

async function serverLoginAction(data: FormData) {
  "use server";
  return await loginAction(getServerPocketBase(true), data);
}
