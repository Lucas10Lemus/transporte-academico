import RoleSelector from "@/components/RoleSelector";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Role = "ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT";

interface RoleSwitcherProps {
  onRoleSelect: (role: Role) => void;
}

export default function RoleSwitcher({ onRoleSelect }: RoleSwitcherProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN");

  const handleContinue = () => {
    onRoleSelect(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30" data-testid="page-role-switcher">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold mb-2">Select Your Role</CardTitle>
          <p className="text-muted-foreground">
            Choose a role to view the dashboard. This is for demo purposes only.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
          <Button 
            onClick={handleContinue} 
            className="w-full" 
            size="lg"
            data-testid="button-continue"
          >
            Continue as {selectedRole}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
