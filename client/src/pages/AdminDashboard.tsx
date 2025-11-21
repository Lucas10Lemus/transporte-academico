import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bus, AlertCircle, Wallet, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type Stats = {
  totalStudents: number;
  activeRoutes: number;
  pendingPayments: number;
  totalRevenue: string;
};

export default function AdminDashboard() {
  // Busca dados reais (você pode criar esse endpoint /api/stats depois se quiser, 
  // por enquanto vamos usar os endpoints que já temos para calcular ou mostrar loading)
  
  const { data: usersData } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => apiRequest("/api/users"),
  });

  const { data: routesData } = useQuery({
    queryKey: ["/api/routes"],
    queryFn: async () => apiRequest("/api/routes"),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["/api/payments"],
    queryFn: async () => apiRequest("/api/payments"),
  });

  // Cálculos simples com os dados carregados
  const totalStudents = usersData?.users?.filter((u: any) => u.role === "STUDENT").length || 0;
  const activeRoutes = routesData?.routes?.filter((r: any) => r.isActive).length || 0;
  const pendingPayments = paymentsData?.payments?.filter((p: any) => p.status === "PENDING").length || 0;
  
  // Mock de receita para exemplo (soma dos 'paid')
  const revenue = paymentsData?.payments
    ?.filter((p: any) => p.status === "PAID")
    .reduce((acc: number, curr: any) => acc + parseFloat(curr.amountDue), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visão Geral</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel de controle.</p>
        </div>
        <Link href="/students">
          <Button>
            <Users className="mr-2 h-4 w-4" /> Gerenciar Alunos
          </Button>
        </Link>
      </div>

      {/* GRID DE ESTATÍSTICAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Matriculados e ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotas Ativas</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoutes}</div>
            <p className="text-xs text-muted-foreground">
              Operando hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Mensalidades em aberto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (Mês)</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recebido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO DE ATALHOS RÁPIDOS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link href="/routes">
              <div className="flex items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Gerenciar Rotas</p>
                  <p className="text-sm text-muted-foreground">Criar ou editar itinerários</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/payments">
              <div className="flex items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Financeiro</p>
                  <p className="text-sm text-muted-foreground">Dar baixa em pagamentos</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* LISTA DE DEVEDORES (RESUMO) */}
        <Card className="col-span-1 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Existem <strong>{pendingPayments}</strong> alunos com mensalidades pendentes.
            </p>
            <Link href="/payments">
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                Ver Lista de Cobrança
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}