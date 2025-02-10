import FilterSidebar from '@/components/filter-sidebar'
import PropertyList from '@/components/property-list'
import { createClient } from '@/utils/supabase/server'


export default async function Page() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  console.log('p', properties)

  return <div className="flex w-full h-full gap-4 overflow-hidden flex-col md:flex-row">
    <FilterSidebar />
    <PropertyList properties={properties as any[]} />
  </div>
}



