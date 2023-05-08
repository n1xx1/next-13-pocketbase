import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POCKETBASE_URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_POCKETBASE_URL: z.string(),
  },
  runtimeEnv: {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL,
  },
});
