import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import { User, Shield, Smartphone, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  
  // Estados para edição (Futuro: Conectar com API de update)
  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências do sistema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* CARTÃO DE PERFIL */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Meu Perfil</CardTitle>
            </div>
            <CardDescription>Suas informações pessoais de acesso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>E-mail (Login)</Label>
              <Input value={user?.email} disabled className="bg-muted text-muted-foreground" />
              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
            </div>

            <div className="space-y-2">
              <Label>Telefone / WhatsApp</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="pt-2">
              <Label>Nível de Acesso</Label>
              <div className="mt-2">
                <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                  {user?.role === "ADMIN" ? "Administrador Geral" : user?.role}
                </Badge>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline" disabled>
              Salvar Alterações (Em Breve)
            </Button>
          </CardContent>
        </Card>

        {/* PREFERÊNCIAS E SISTEMA */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" />
                <CardTitle>Aparência</CardTitle>
              </div>
              <CardDescription>Escolha como você quer ver o sistema.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tema do Sistema</Label>
                <p className="text-sm text-muted-foreground">Alternar entre modo Claro e Escuro</p>
              </div>
              <ThemeToggle />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle>Segurança e Versão</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Versão do Sistema</span>
                <Badge variant="outline">v1.0.0 (MVP)</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Status do PWA</span>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Ativo
                </Badge>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive" className="w-full" onClick={() => alert("Funcionalidade de trocar senha será implementada na v2.")}>
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}