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
  // Faz a requisição para o backend (proxy configurado no Vite)
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Se der erro (4xx ou 5xx), lança uma exceção
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Erro desconhecido na API");
  }

  // Se for 204 (No Content), retorna null
  if (res.status === 204) {
    return null;
  }

  // Retorna o JSON da resposta
  return res.json();
}