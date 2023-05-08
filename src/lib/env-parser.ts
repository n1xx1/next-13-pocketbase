// import { z } from "zod";

// type EnvObject = Record<string, z.ZodType>;

// type CreateEnvOps<TServer extends EnvObject, TClient extends EnvObject> = {
//   server: TServer;
// };

// export function createEnv<
//   TServer extends EnvObject = NonNullable<unknown>,
//   TClient extends EnvObject = NonNullable<unknown>
// >({}: CreateEnvOps<TServer, TClient>) {
//   return new Proxy(
//     {},
//     {
//       get(target, prop) {},
//     }
//   );
// }
export {};
