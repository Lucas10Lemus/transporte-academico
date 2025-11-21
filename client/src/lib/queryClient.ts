import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Função padrão para buscar dados (AQUI ESTAVA FALTANDO)
const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey.join("/");
  const res = await fetch(url, {
    credentials: "include", // <--- VITAL: Envia o cookie para o servidor
  });

  if (!res.ok) {
    if (res.status === 401) {
      return null; 
    }
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export async function apiRequest(
  url: string,
  options: RequestInit | undefined = {}
) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // <--- VITAL: Envia o cookie aqui também
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Erro na requisição");
  }

  if (res.status === 204) return null;

  return res.json();
}