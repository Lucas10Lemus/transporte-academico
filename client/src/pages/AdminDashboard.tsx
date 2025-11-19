import StatsCard from "@/components/StatsCard";
import RouteCard from "@/components/RouteCard";
import PaymentTable from "@/components/PaymentTable";
import { Bus, Users, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const mockPayments = [
    { id: '1', studentName: 'Ana Costa', route: 'North Campus', amount: 250, status: 'PAID' as const, dueDate: '2025-11-05' },
    { id: '2', studentName: 'Bruno Lima', route: 'South Campus', amount: 250, status: 'PENDING' as const, dueDate: '2025-11-10' },
    { id: '3', studentName: 'Carla Souza', route: 'East Campus', amount: 250, status: 'OVERDUE' as const, dueDate: '2025-10-15' },
    { id: '4', studentName: 'Daniel Rocha', route: 'West Campus', amount: 250, status: 'PAID' as const, dueDate: '2025-11-05' },
  ];

  return (
    <div className="space-y-6" data-testid="page-admin-dashboard">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Routes" value={12} icon={Bus} trend={{ value: 8, isPositive: true }} />
        <StatsCard title="Total Students" value={245} icon={Users} />
        <StatsCard title="Monthly Revenue" value="R$ 61,250" icon={DollarSign} trend={{ value: 12, isPositive: true }} />
        <StatsCard title="Pending Payments" value={18} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="outline" size="sm" data-testid="button-view-all-payments">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <PaymentTable 
                payments={mockPayments}
                onViewDetails={(id) => console.log('View details:', id)}
                onMarkPaid={(id) => console.log('Mark paid:', id)}
                onSendReminder={(id) => console.log('Send reminder:', id)}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">New student enrolled</p>
                    <p className="text-xs text-muted-foreground">North Campus Route • 2h ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">R$ 250.00 • 3h ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Route capacity updated</p>
                    <p className="text-xs text-muted-foreground">South Campus Route • 5h ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Active Routes</h2>
          <Button data-testid="button-add-route">Add Route</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouteCard
            id="1"
            name="North Campus Route"
            driverName="João Silva"
            capacity={30}
            enrolled={24}
            startTime="07:00"
            isActive={true}
            onViewDetails={() => console.log('View details')}
            onEdit={() => console.log('Edit route')}
          />
          <RouteCard
            id="2"
            name="South Campus Route"
            driverName="Maria Santos"
            capacity={25}
            enrolled={25}
            startTime="07:30"
            isActive={true}
            onViewDetails={() => console.log('View details')}
            onEdit={() => console.log('Edit route')}
          />
          <RouteCard
            id="3"
            name="East Campus Route"
            driverName="Carlos Oliveira"
            capacity={28}
            enrolled={22}
            startTime="07:15"
            isActive={true}
            onViewDetails={() => console.log('View details')}
            onEdit={() => console.log('Edit route')}
          />
        </div>
      </div>
    </div>
  );
}
