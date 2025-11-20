import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter"; // Importamos o hook de navegação
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth(); // Pegamos o 'user' do contexto
  const { toast } = useToast();
  const [, setLocation] = useLocation(); // Hook para mudar de página

  // Efeito automático: Se o usuário já estiver logado, redireciona ele
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        setLocation("/admin");
        break;
      case "COORDINATOR":
        setLocation("/admin"); // Ou /coordinator se existir
        break;
      case "DRIVER":
        setLocation("/driver");
        break;
      case "STUDENT":
        setLocation("/student");
        break;
      default:
        setLocation("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
      // O useEffect acima vai cuidar do redirecionamento assim que o 'user' mudar
    } catch (error: any) {
      toast({
        title: "Falha no Login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      setIsLoading(false); // Só paramos de carregar se der erro
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Bus className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Transporte Acadêmico</CardTitle>
            <CardDescription>Sistema de Gestão de Transporte</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@transport.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Credenciais de Teste:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin@transport.com / admin123</p>
              <p>Motorista: joao@transport.com / driver123</p>
              <p>Aluno: ana@student.com / student123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}