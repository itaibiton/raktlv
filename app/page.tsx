import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  return <div className="flex w-full h-full gap-4">
    <div className="w-3/12 border rounded p-4">Filter</div>
    <ul className="grid grid-cols-12 w-full gap-4 overflow-y-auto">
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
      {properties?.map((property) => <PropertyCard property={property} />)}
    </ul>
  </div>
}



const PropertyCard = ({ property }: { property: any }) => {
  return <div className="col-span-4 border h-40 rounded p-4">{property.address}</div>
}