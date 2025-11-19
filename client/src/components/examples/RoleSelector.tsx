import RoleSelector from '../RoleSelector'
import { useState } from 'react'

export default function RoleSelectorExample() {
  const [role, setRole] = useState<"ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT">("ADMIN")
  
  return (
    <div className="p-6">
      <RoleSelector selectedRole={role} onSelectRole={setRole} />
      <p className="mt-4 text-center text-sm text-muted-foreground">Selected: {role}</p>
    </div>
  )
}
