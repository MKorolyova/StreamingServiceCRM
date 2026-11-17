import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URL: z.url({
    protocol: /^postgres(ql)?(\+\w+)?$/,
    error: "POSTGRES_URL must be a postgres:// or postgresql:// connection URL.",
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsedEnv.error)}`);
}

export const env = parsedEnv.data;
