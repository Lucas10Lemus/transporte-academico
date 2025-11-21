import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Plus, Trash2 } from "lucide-react";

type Route = {
  id: string;
  name: string;
  maxCapacity: number;
  startTime: string;
  isActive: boolean;
};

export default function RoutesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Busca as rotas do servidor
  const { data: routesData, isLoading } = useQuery<{ routes: Route[] }>({
    queryKey: ["/api/routes"],
  });

  const routes = routesData?.routes || [];

  // Criar rota
  const createMutation = useMutation({
    mutationFn: async (newRoute: any) => {
      await apiRequest("/api/routes", {
        method: "POST",
        body: JSON.stringify(newRoute),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      setIsDialogOpen(false);
      toast({ title: "Rota criada com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar rota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Excluir rota
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/routes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({ title: "Rota removida." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    createMutation.mutate({
      name: formData.get("name"),
      startTime: formData.get("startTime"),
      maxCapacity: parseInt(formData.get("maxCapacity") as string),
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Rotas</h1>
          <p className="text-muted-foreground">Organize os itinerários.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Rota</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Rota</Label>
                <Input id="name" name="name" placeholder="Ex: Rota Centro" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Saída</Label>
                  <Input id="startTime" name="startTime" type="time" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Lotação</Label>
                  <Input id="maxCapacity" name="maxCapacity" type="number" min="1" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Criar Rota"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div>Carregando...</div> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{route.name}</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{route.startTime}</div>
                <p className="text-xs text-muted-foreground mt-1">Capacidade: {route.maxCapacity}</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    if(confirm("Tem certeza?")) deleteMutation.mutate(route.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}