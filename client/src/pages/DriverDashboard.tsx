import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Phone, MapPin, Search, RefreshCw, Sun, Moon } from "lucide-react";

type ManifestItem = {
  studentId: string;
  name: string;
  phone: string;
  university: string;
  routeName: string;
  statusIda: boolean;
  statusVolta: boolean;
  pickupLocation: string;
};

export default function DriverDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("TODAS");

  const { data, isLoading, refetch } = useQuery<{ manifest: ManifestItem[] }>({
    queryKey: ["/api/driver/manifest"],
    queryFn: async () => apiRequest("/api/driver/manifest"),
    refetchInterval: 30000, 
  });

  const manifest = data?.manifest || [];

  const filteredList = manifest.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUni = universityFilter === "TODAS" || item.university === universityFilter;
    return matchesSearch && matchesUni;
  });

  const countIda = manifest.filter(i => i.statusIda).length;
  const countVolta = manifest.filter(i => i.statusVolta).length;

  const StudentList = ({ type }: { type: "IDA" | "VOLTA" }) => {
    const list = filteredList.filter(item => type === "IDA" ? item.statusIda : item.statusVolta);

    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground opacity-60">
          <div className="bg-muted p-4 rounded-full mb-3">
            {type === "IDA" ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </div>
          <p>Ninguém confirmou para a {type} ainda.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {list.map((student) => (
          <div key={student.studentId} className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm">
            <div className="space-y-1">
              <p className="font-bold text-lg leading-none">{student.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs font-normal h-5">
                  {student.university || "Faculdade"}
                </Badge>
                <span className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3" /> {student.pickupLocation}
                </span>
              </div>
            </div>
            
            <Button 
              size="icon" 
              className="rounded-full bg-green-600 hover:bg-green-700 text-white h-10 w-10 shrink-0 shadow-sm"
              onClick={() => window.open(`https://wa.me/${student.phone?.replace(/\D/g, '')}`, '_blank')}
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 pb-24">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Lista de Presença</h1>
          <p className="text-sm text-muted-foreground">Motorista: {user?.fullName.split(" ")[0]}</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => refetch()} className="shrink-0">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Filtros */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-2 -mx-4 px-4 mb-4 border-b shadow-sm">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar passageiro..." 
            className="pl-9 bg-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["TODAS", "UniFacema", "IFMA", "UEMA"].map(uni => (
            <Badge 
              key={uni}
              variant={universityFilter === uni ? "default" : "outline"}
              className="h-7 px-3 cursor-pointer whitespace-nowrap"
              onClick={() => setUniversityFilter(uni)}
            >
              {uni}
            </Badge>
          ))}
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="IDA" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="IDA" className="text-base gap-2">
            <Sun className="w-4 h-4 text-orange-500" /> IDA ({countIda})
          </TabsTrigger>
          <TabsTrigger value="VOLTA" className="text-base gap-2">
            <Moon className="w-4 h-4 text-blue-500" /> VOLTA ({countVolta})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="IDA">
          <StudentList type="IDA" />
        </TabsContent>

        <TabsContent value="VOLTA">
          <StudentList type="VOLTA" />
        </TabsContent>
      </Tabs>
    </div>
  );
}