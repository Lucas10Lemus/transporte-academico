import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, Trash2, User } from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
};

export default function StudentsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Busca todos os usuários
  const { data: usersData, isLoading } = useQuery<{ users: Student[] }>({
    queryKey: ["/api/users"],
  });

  // Filtra apenas quem é ALUNO (STUDENT)
  const students = usersData?.users?.filter(u => u.role === "STUDENT") || [];

  // Filtra pela busca
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Criação de Novo Aluno
  const createMutation = useMutation({
    mutationFn: async (newStudent: any) => {
      // Chama a rota de registro (que cria login e senha)
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...newStudent,
          role: "STUDENT", // Força o papel de aluno
          passwordHash: "123456", // Senha padrão inicial (pode mudar depois)
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      toast({ 
        title: "Aluno cadastrado!", 
        description: "A senha inicial é: 123456" 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 3. Exclusão de Aluno
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/users/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Aluno removido." });
    },
    onError: (error: any) => {
      toast({
        title: "Não foi possível remover",
        description: "Verifique se o aluno possui pagamentos ou matrículas ativas.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    createMutation.mutate({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      institution: formData.get("institution"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie o cadastro dos estudantes.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input id="fullName" name="fullName" placeholder="Ex: João da Silva" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (Login)</Label>
                <Input id="email" name="email" type="email" placeholder="joao@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefone (WhatsApp)</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="(99) 99999-9999" required />
              </div>
              <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-200">
                ⚠️ A senha inicial será definida automaticamente como <strong>123456</strong>.
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Cadastrar"}
              </Button>
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input id="institution" name="institution" placeholder="Ex: IFMA, UEMA..." />
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Carregando lista...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            {student.fullName}
                            <div className="text-xs text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if(confirm(`Tem certeza que deseja remover ${student.fullName}?`)) {
                              deleteMutation.mutate(student.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum aluno encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}