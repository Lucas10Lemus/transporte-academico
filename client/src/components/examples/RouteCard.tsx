import RouteCard from '../RouteCard'

export default function RouteCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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
    </div>
  )
}
