import StudentChecklistItem from "@/components/StudentChecklistItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, CheckCircle } from "lucide-react";

export default function DriverDashboard() {
  const students = [
    { id: '1', name: 'Pedro Oliveira', pickupTime: '07:15', location: 'Av. Principal, 123', phoneNumber: '+55 11 98765-4321', checkedIn: false },
    { id: '2', name: 'Juliana Ferreira', pickupTime: '07:25', location: 'Rua das Flores, 456', phoneNumber: '+55 11 91234-5678', checkedIn: true },
    { id: '3', name: 'Lucas Andrade', pickupTime: '07:35', location: 'Praça Central, 789', phoneNumber: '+55 11 99876-5432', checkedIn: false },
    { id: '4', name: 'Mariana Costa', pickupTime: '07:45', location: 'Av. Secundária, 321', phoneNumber: '+55 11 98123-4567', checkedIn: false },
  ];

  const checkedInCount = students.filter(s => s.checkedIn).length;

  return (
    <div className="space-y-6" data-testid="page-driver-dashboard">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Today's Route</h1>
        <p className="text-muted-foreground">North Campus Route - November 19, 2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Time</p>
                <p className="text-2xl font-semibold">07:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-semibold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-2xl font-semibold">{checkedInCount}/{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Student Checklist
          </CardTitle>
          <Badge variant="secondary" data-testid="badge-progress">
            {checkedInCount} of {students.length} checked in
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {students.map((student) => (
            <StudentChecklistItem
              key={student.id}
              id={student.id}
              name={student.name}
              pickupTime={student.pickupTime}
              location={student.location}
              phoneNumber={student.phoneNumber}
              initialCheckedIn={student.checkedIn}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" data-testid="button-view-map">
          <MapPin className="h-4 w-4 mr-2" />
          View Route Map
        </Button>
        <Button variant="default" className="flex-1" data-testid="button-complete-route">
          Complete Route
        </Button>
      </div>
    </div>
  );
}
