import axios, { type AxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const httpClient = axios.create({ baseURL: API_URL });

export async function apiFetch<T>(path: string, fallbackMessage: string): Promise<T> {
  try {
    const response = await httpClient.get<T>(path);
    return response.data;
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      throw new ApiError(500, fallbackMessage);
    }

    const axiosError = err as AxiosError<{ detail?: string }>;
    if (!axiosError.response) {
      throw new ApiError(503, "Tidak bisa menghubungi server. Coba lagi nanti.");
    }

    const detail = axiosError.response.data?.detail;
    throw new ApiError(
      axiosError.response.status,
      typeof detail === "string" ? detail : fallbackMessage,
    );
  }
}
