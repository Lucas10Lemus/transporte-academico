import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Bus, MapPin, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PresenceResponse = {
  presence: {
    id: string;
    statusIda: boolean;
    statusVolta: boolean;
    observation?: string;
  } | null;
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const today = new Date();

  const { data, isLoading } = useQuery<PresenceResponse>({
    queryKey: ["/api/presence/today"],
    queryFn: async () => apiRequest("/api/presence/today"),
  });

  const [statusIda, setStatusIda] = useState(false);
  const [statusVolta, setStatusVolta] = useState(false);

  useEffect(() => {
    if (data?.presence) {
      setStatusIda(data.presence.statusIda);
      setStatusVolta(data.presence.statusVolta);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newStatus: { ida: boolean; volta: boolean }) => {
      const res = await apiRequest("/api/presence", {
        method: "POST",
        body: JSON.stringify({
          studentId: user?.id,
          statusIda: newStatus.ida,
          statusVolta: newStatus.volta,
          observation: "",
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presence/today"] });
      toast({
        title: "Sucesso!",
        description: "Sua presença foi confirmada.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao marcar",
        description: "Não foi possível atualizar sua presença.",
        variant: "destructive",
      });
      // Reverte visualmente em caso de erro
      if (data?.presence) {
        setStatusIda(data.presence.statusIda);
        setStatusVolta(data.presence.statusVolta);
      }
    },
  });

  const handleToggleIda = () => {
    const novoStatus = !statusIda;
    setStatusIda(novoStatus);
    mutation.mutate({ ida: novoStatus, volta: statusVolta });
  };

  const handleToggleVolta = () => {
    const novoStatus = !statusVolta;
    setStatusVolta(novoStatus);
    mutation.mutate({ ida: statusIda, volta: novoStatus });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Carregando status...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 pb-20">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-primary">Olá, {user?.fullName.split(" ")[0]}!</h1>
        <p className="text-muted-foreground capitalize">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Status Financeiro */}
      <Card className="mb-6 border-l-4 border-l-yellow-500 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mensalidade (Nov)</p>
            <p className="text-lg font-bold text-yellow-600">Pendente</p>
          </div>
          <Button variant="outline" size="sm">Ver Detalhes</Button>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bus className="w-5 h-5" />
        Sua Presença Hoje
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* IDA */}
        <Card className={`transition-all duration-300 ${statusIda ? "border-green-500 bg-green-50/50" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">IDA</CardTitle>
                  <p className="text-sm text-muted-foreground">Saída às 17:00</p>
                </div>
              </div>
              {statusIda && <CheckCircle className="text-green-500 w-6 h-6" />}
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className={`w-full h-12 text-lg font-semibold ${
                statusIda 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={handleToggleIda}
              disabled={mutation.isPending}
            >
              {statusIda ? "VOU NA IDA" : "NÃO VOU"}
            </Button>
          </CardContent>
        </Card>

        {/* VOLTA */}
        <Card className={`transition-all duration-300 ${statusVolta ? "border-green-500 bg-green-50/50" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">VOLTA</CardTitle>
                  <p className="text-sm text-muted-foreground">Saída às 22:00</p>
                </div>
              </div>
              {statusVolta && <CheckCircle className="text-green-500 w-6 h-6" />}
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className={`w-full h-12 text-lg font-semibold ${
                statusVolta 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={handleToggleVolta}
              disabled={mutation.isPending}
            >
              {statusVolta ? "VOU NA VOLTA" : "NÃO VOU"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button variant="ghost" className="w-full text-muted-foreground flex gap-2">
          <MapPin className="w-4 h-4" />
          Alterar ponto de embarque
        </Button>
      </div>
    </div>
  );
}