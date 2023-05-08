import { registerAction } from "@/actions/register";
import { getServerPocketBase } from "@/components/auth/server";
import { RegisterPage } from "@/components/pages/register";

export default function Page() {
  return <RegisterPage registerAction={serverRegisterAction} />;
}

async function serverRegisterAction(data: FormData) {
  "use server";
  return await registerAction(getServerPocketBase(true), data);
}
