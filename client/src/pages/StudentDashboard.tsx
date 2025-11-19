import NextPickupCard from "@/components/NextPickupCard";
import PaymentStatusCard from "@/components/PaymentStatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  return (
    <div className="space-y-6" data-testid="page-student-dashboard">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's your transport schedule for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NextPickupCard
            pickupTime="07:15"
            location="Av. Principal, 123 - Centro"
            driverName="João Silva"
            routeName="North Campus"
            timeUntilPickup="in 45 minutes"
          />
        </div>
        <div>
          <PaymentStatusCard
            status="PENDING"
            amount={250}
            dueDate="Dec 05, 2025"
            month="December 2025"
            onPayNow={() => console.log('Pay now')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Route Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Route Name</p>
              <p className="font-medium">North Campus Route</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Driver</p>
              <p className="font-medium">João Silva</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Pickup Time</p>
                <p className="font-medium">07:15 AM</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Drop-off Time</p>
                <p className="font-medium">08:00 AM</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-view-route">
              <MapPin className="h-4 w-4 mr-2" />
              View Route Map
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Driver</p>
              <p className="font-medium">+55 11 98765-4321</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Coordinator</p>
              <p className="font-medium">+55 11 91234-5678</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Support Office</p>
              <p className="font-medium">+55 11 3456-7890</p>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-call-support">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            This Week's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">{day}</span>
                <span className="text-sm text-muted-foreground">07:15 - 08:00</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
