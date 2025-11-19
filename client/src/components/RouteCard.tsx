import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RouteCardProps {
  id: string;
  name: string;
  driverName: string;
  capacity: number;
  enrolled: number;
  startTime: string;
  isActive: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
}

export default function RouteCard({
  id,
  name,
  driverName,
  capacity,
  enrolled,
  startTime,
  isActive,
  onViewDetails,
  onEdit,
}: RouteCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-route-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <Badge variant={isActive ? "default" : "secondary"} data-testid={`badge-status-${id}`}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm">
              {driverName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{driverName}</p>
            <p className="text-xs text-muted-foreground">Driver</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{enrolled}/{capacity}</p>
              <p className="text-xs text-muted-foreground">Capacity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{startTime}</p>
              <p className="text-xs text-muted-foreground">Start Time</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails} data-testid={`button-view-${id}`}>
            View Details
          </Button>
          <Button variant="default" size="sm" className="flex-1" onClick={onEdit} data-testid={`button-edit-${id}`}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
