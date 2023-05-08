import { getServerPocketBase } from "@/components/auth/server";
import { HomePage } from "@/components/pages/home";

export default function Page() {
  const pb = getServerPocketBase();

  return (
    <HomePage>
      isValid: {pb.authStore.isValid ? "true" : "false"}, username:{" "}
      {pb.authStore.model?.username ?? "?"}
    </HomePage>
  );
}
