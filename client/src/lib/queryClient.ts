import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Criação do cliente React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

// Função genérica para chamadas de API
export async function apiRequest(
  url: string,
  options: RequestInit | undefined = {}
) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Erro na requisição");
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}