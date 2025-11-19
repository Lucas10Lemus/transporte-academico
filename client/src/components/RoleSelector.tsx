import { Card, CardContent } from "@/components/ui/card";
import { Shield, Bus, Users, GraduationCap } from "lucide-react";

type Role = "ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT";

interface RoleSelectorProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
}

export default function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  const roles = [
    { value: "ADMIN" as Role, label: "Admin", icon: Shield, color: "text-primary" },
    { value: "COORDINATOR" as Role, label: "Coordinator", icon: Users, color: "text-chart-2" },
    { value: "DRIVER" as Role, label: "Driver", icon: Bus, color: "text-chart-4" },
    { value: "STUDENT" as Role, label: "Student", icon: GraduationCap, color: "text-chart-3" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.value;
        return (
          <Card
            key={role.value}
            className={`cursor-pointer hover-elevate active-elevate-2 ${
              isSelected ? 'border-primary border-2' : ''
            }`}
            onClick={() => onSelectRole(role.value)}
            data-testid={`card-role-${role.value.toLowerCase()}`}
          >
            <CardContent className="p-6 text-center">
              <Icon className={`h-8 w-8 mx-auto mb-2 ${role.color}`} />
              <p className="font-medium">{role.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
