import PaymentStatusCard from '../PaymentStatusCard'

export default function PaymentStatusCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <PaymentStatusCard
        status="PAID"
        amount={250}
        dueDate="Nov 05, 2025"
        month="November 2025"
        onPayNow={() => console.log('Pay now')}
      />
      <PaymentStatusCard
        status="PENDING"
        amount={250}
        dueDate="Dec 05, 2025"
        month="December 2025"
        onPayNow={() => console.log('Pay now')}
      />
      <PaymentStatusCard
        status="OVERDUE"
        amount={250}
        dueDate="Oct 05, 2025"
        month="October 2025"
        onPayNow={() => console.log('Pay now')}
      />
    </div>
  )
}
