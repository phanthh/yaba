import { AnySchema, InferType } from "yup";
import { errorHandler, ResponseError } from "./errors";
import { getEnv } from "./getEnv";
import { HTTPMethod } from "./types";

type FetcherConfig<Schema extends AnySchema | null> = {
  readonly method: HTTPMethod;
  readonly schema?: Schema;
  readonly token?: string;
  readonly body?: object;
  readonly config?: RequestInit;
};

const apiUrl =
  getEnv("NODE_ENV") === "development" ? getEnv("REACT_APP_API_URL") : "";

export async function fetcher<Schema extends null>(
  path: string,
  { method, schema, token, body, config }: FetcherConfig<Schema>
): Promise<null>;

export async function fetcher<Schema extends AnySchema>(
  path: string,
  { method, schema, token, body, config }: FetcherConfig<Schema>
): Promise<InferType<Schema>>;

export async function fetcher<Schema extends AnySchema | null>(
  path: string,
  { method, schema, token, body, config }: FetcherConfig<Schema>
) {
  try {
    const res = await fetch(`${apiUrl}${path}`, {
      ...config,
      ...(body && { body: JSON.stringify(body) }),
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (res.ok) {
      if (!schema) {
        return;
      }

      const data = await res.json();
      const validated = await schema.validate(data);

      return validated;
    }

    const data = await res.json();
    throw new ResponseError(data.error, res.status);
  } catch (error) {
    errorHandler(error);
  }
}
