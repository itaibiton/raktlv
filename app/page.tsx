import PropertyList from '@/components/property-list'
import { createClient } from '@/utils/supabase/server'


export default async function Page() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  console.log('p', properties)

  return <div className="flex w-full h-full gap-4">
    <div className="w-3/12 border rounded p-4">Filter</div>

    <PropertyList properties={properties as any[]} />
  </div>
}



