import NextPickupCard from '../NextPickupCard'

export default function NextPickupCardExample() {
  return (
    <div className="p-6 max-w-md">
      <NextPickupCard
        pickupTime="07:15"
        location="Av. Principal, 123 - Centro"
        driverName="João Silva"
        routeName="North Campus"
        timeUntilPickup="in 45 minutes"
      />
    </div>
  )
}
