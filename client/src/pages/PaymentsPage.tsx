import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Search, AlertCircle, Wallet } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Payment = {
  id: string;
  enrollmentId: string;
  amountDue: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  billingMonth: string;
  paidAt?: string;
};

type User = {
  id: string;
  fullName: string;
};

type Enrollment = {
  id: string;
  studentId: string;
};

export default function PaymentsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 1. Buscamos Pagamentos, Alunos e Matrículas para cruzar os dados
  const { data: paymentsData } = useQuery<{ payments: Payment[] }>({
    queryKey: ["/api/payments"],
  });
  const { data: usersData } = useQuery<{ users: User[] }>({
    queryKey: ["/api/users"],
  });
  const { data: enrollmentsData } = useQuery<{ enrollments: Enrollment[] }>({
    queryKey: ["/api/enrollments"],
  });

  const payments = paymentsData?.payments || [];
  const users = usersData?.users || [];
  const enrollments = enrollmentsData?.enrollments || [];

  // Função para achar o nome do aluno baseado no pagamento
  const getStudentName = (enrollmentId: string) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return "Desconhecido";
    const student = users.find(u => u.id === enrollment.studentId);
    return student?.fullName || "Aluno Removido";
  };

  // 2. Filtros (Busca por nome e Status)
  const filteredPayments = payments.filter(payment => {
    const studentName = getStudentName(payment.enrollmentId).toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 3. Dar Baixa no Pagamento
  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "PAID" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Pagamento confirmado!", className: "bg-green-600 text-white" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cálculo de totais
  const totalPending = payments.filter(p => p.status === "PENDING").length;
  const totalOverdue = payments.filter(p => p.status === "OVERDUE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Controle de mensalidades e inadimplência.</p>
        </div>
        
        {/* Resumo Rápido */}
        <div className="flex gap-4">
          <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
            <span className="text-xs text-orange-600 font-bold uppercase">Pendentes</span>
            <div className="text-2xl font-bold text-orange-700">{totalPending}</div>
          </div>
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            <span className="text-xs text-red-600 font-bold uppercase">Atrasados</span>
            <div className="text-2xl font-bold text-red-700">{totalOverdue}</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="PAID">Pagos</SelectItem>
                <SelectItem value="OVERDUE">Atrasados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Mês Ref.</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {getStudentName(payment.enrollmentId)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(payment.billingMonth), "MMMM yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>R$ {payment.amountDue}</TableCell>
                    <TableCell>
                      {payment.status === "PAID" && (
                        <Badge className="bg-green-600">Pago</Badge>
                      )}
                      {payment.status === "PENDING" && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                          Pendente
                        </Badge>
                      )}
                      {payment.status === "OVERDUE" && (
                        <Badge variant="destructive">Atrasado</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status !== "PAID" && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            if(confirm("Confirmar recebimento deste pagamento?")) {
                              payMutation.mutate(payment.id);
                            }
                          }}
                          disabled={payMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Dar Baixa
                        </Button>
                      )}
                      {payment.status === "PAID" && (
                        <span className="text-xs text-muted-foreground">
                          Pago em {format(new Date(payment.paidAt || ""), "dd/MM")}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum pagamento encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}