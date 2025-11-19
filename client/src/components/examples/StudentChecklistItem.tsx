import StudentChecklistItem from '../StudentChecklistItem'

export default function StudentChecklistItemExample() {
  return (
    <div className="space-y-4 p-6">
      <StudentChecklistItem
        id="1"
        name="Pedro Oliveira"
        pickupTime="07:15"
        location="Av. Principal, 123"
        phoneNumber="+55 11 98765-4321"
        initialCheckedIn={false}
      />
      <StudentChecklistItem
        id="2"
        name="Juliana Ferreira"
        pickupTime="07:25"
        location="Rua das Flores, 456"
        phoneNumber="+55 11 91234-5678"
        initialCheckedIn={true}
      />
    </div>
  )
}
