import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Phone } from "lucide-react";
import { useState } from "react";

interface StudentChecklistItemProps {
  id: string;
  name: string;
  pickupTime: string;
  location: string;
  phoneNumber: string;
  initialCheckedIn?: boolean;
}

export default function StudentChecklistItem({
  id,
  name,
  pickupTime,
  location,
  phoneNumber,
  initialCheckedIn = false,
}: StudentChecklistItemProps) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);

  return (
    <Card className={`p-4 ${checkedIn ? 'bg-success/10' : ''}`} data-testid={`card-student-${id}`}>
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{name}</h4>
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-xs text-muted-foreground">{pickupTime}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => console.log('Call:', phoneNumber)}
            data-testid={`button-call-${id}`}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant={checkedIn ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setCheckedIn(!checkedIn);
              console.log('Check-in toggled:', id, !checkedIn);
            }}
            data-testid={`button-checkin-${id}`}
            className="gap-2"
          >
            {checkedIn && <Check className="h-4 w-4" />}
            {checkedIn ? 'Checked In' : 'Check In'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
