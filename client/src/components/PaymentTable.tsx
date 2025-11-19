import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface Payment {
  id: string;
  studentName: string;
  route: string;
  amount: number;
  status: "PAID" | "PENDING" | "OVERDUE";
  dueDate: string;
}

interface PaymentTableProps {
  payments: Payment[];
  onViewDetails?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  onSendReminder?: (id: string) => void;
}

export default function PaymentTable({
  payments,
  onViewDetails,
  onMarkPaid,
  onSendReminder,
}: PaymentTableProps) {
  const getStatusVariant = (status: Payment["status"]) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "OVERDUE":
        return "destructive";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="rounded-md border" data-testid="table-payments">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
              <TableCell className="font-medium">{payment.studentName}</TableCell>
              <TableCell>{payment.route}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payment.status)} data-testid={`badge-status-${payment.id}`}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{payment.dueDate}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid={`button-menu-${payment.id}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails?.(payment.id)} data-testid={`menu-view-${payment.id}`}>
                      View Details
                    </DropdownMenuItem>
                    {payment.status !== "PAID" && (
                      <DropdownMenuItem onClick={() => onMarkPaid?.(payment.id)} data-testid={`menu-markpaid-${payment.id}`}>
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    {payment.status === "OVERDUE" && (
                      <DropdownMenuItem onClick={() => onSendReminder?.(payment.id)} data-testid={`menu-remind-${payment.id}`}>
                        Send Reminder
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
