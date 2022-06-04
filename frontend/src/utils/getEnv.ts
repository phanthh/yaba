type Env = {
  readonly NODE_ENV: "development" | "production";
  readonly REACT_APP_API_URL: string;
};

export function getEnv<T extends keyof Env>(name: T): Env[T];
export function getEnv(name: keyof Env): Env[keyof Env] {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Cannot find environment variable ${name}`);
  }
  return value;
}
