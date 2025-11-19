import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NextPickupCardProps {
  pickupTime: string;
  location: string;
  driverName: string;
  routeName: string;
  timeUntilPickup: string;
}

export default function NextPickupCard({
  pickupTime,
  location,
  driverName,
  routeName,
  timeUntilPickup,
}: NextPickupCardProps) {
  return (
    <Card className="bg-primary text-primary-foreground" data-testid="card-next-pickup">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Next Pickup</span>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
            {routeName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <div className="text-5xl font-bold mb-2">{pickupTime}</div>
          <p className="text-sm opacity-90">{timeUntilPickup}</p>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-primary-foreground/20">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Pickup Location</p>
              <p className="text-sm opacity-90">{location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Driver</p>
              <p className="text-sm opacity-90">{driverName}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
