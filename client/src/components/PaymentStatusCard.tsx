import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface PaymentStatusCardProps {
  status: "PAID" | "PENDING" | "OVERDUE";
  amount: number;
  dueDate: string;
  month: string;
  onPayNow?: () => void;
}

export default function PaymentStatusCard({
  status,
  amount,
  dueDate,
  month,
  onPayNow,
}: PaymentStatusCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const statusConfig = {
    PAID: {
      icon: CheckCircle,
      variant: "default" as const,
      color: "text-success",
      bgColor: "bg-success/10",
      label: "Paid",
    },
    PENDING: {
      icon: Clock,
      variant: "secondary" as const,
      color: "text-pending",
      bgColor: "bg-pending/10",
      label: "Pending",
    },
    OVERDUE: {
      icon: AlertCircle,
      variant: "destructive" as const,
      color: "text-overdue",
      bgColor: "bg-overdue/10",
      label: "Overdue",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card data-testid="card-payment-status">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Status</span>
          <Badge variant={config.variant} data-testid="badge-payment-status">
            {config.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${config.bgColor}`}>
          <div className="flex items-center gap-3">
            <Icon className={`h-8 w-8 ${config.color}`} />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{month}</p>
              <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Due Date</span>
          <span className="font-medium">{dueDate}</span>
        </div>

        {status !== "PAID" && (
          <Button 
            variant={status === "OVERDUE" ? "destructive" : "default"} 
            className="w-full" 
            onClick={onPayNow}
            data-testid="button-pay-now"
          >
            Pay Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
