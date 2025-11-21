import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Função genérica para chamadas de API
export async function apiRequest(
  url: string,
  options: RequestInit | undefined = {}
) {
  const res = await fetch(url, {
    ...options,
    // OBRIGATÓRIO: Envia o cookie de sessão para o servidor
    credentials: "include", 
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

// Função padrão que o useQuery vai usar quando não especificarmos uma
const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey.join("/");
  const res = await fetch(url, {
    credentials: "include", // Importante aqui também!
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Se for 401 (Não autorizado), retorna null para não quebrar o app
      // Isso permite que o auth.tsx saiba que não tem usuário logado
      return null; 
    }
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  return res.json();
};

// Configuração do Cliente React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn, // <--- AQUI ESTAVA FALTANDO!
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});