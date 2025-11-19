import PaymentTable from '../PaymentTable'

export default function PaymentTableExample() {
  const mockPayments = [
    { id: '1', studentName: 'Ana Costa', route: 'North Campus', amount: 250, status: 'PAID' as const, dueDate: '2025-11-05' },
    { id: '2', studentName: 'Bruno Lima', route: 'South Campus', amount: 250, status: 'PENDING' as const, dueDate: '2025-11-10' },
    { id: '3', studentName: 'Carla Souza', route: 'East Campus', amount: 250, status: 'OVERDUE' as const, dueDate: '2025-10-15' },
  ]

  return (
    <div className="p-6">
      <PaymentTable 
        payments={mockPayments}
        onViewDetails={(id) => console.log('View details:', id)}
        onMarkPaid={(id) => console.log('Mark paid:', id)}
        onSendReminder={(id) => console.log('Send reminder:', id)}
      />
    </div>
  )
}
