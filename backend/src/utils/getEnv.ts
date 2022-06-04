type Env = {
  readonly SECRET: string;
  readonly DATABASE_URL: string;
  readonly PORT: number;
};

export function getEnv<T extends keyof Env>(name: T): Env[T];
export function getEnv(name: keyof Env): Env[keyof Env] {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Cannot find environment variable ${name}`);
  }
  return value;
}
