import FilterSidebar from '@/components/filter-sidebar'
import PropertyList from '@/components/property-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'
import { Wand2 } from 'lucide-react'


export default async function Page() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  console.log('p', properties)

  return <div className=" h-full w-full flex gap-4 flex-col md:flex-row">
    {/* Left: FilterSidebar */}
    <div className="flex flex-col">
      <FilterSidebar />
    </div>
    {/* Right: PropertyList */}
    <div className="w-full h-full overflow-y-auto">
      <PropertyList properties={properties as any[]} />
    </div>
  </div>
}



const SearchBar = () => {
  return <div className="flex gap-2 flex-col">
    <Label className='flex gap-2 items-center'>
      <Wand2 className='w-4 h-4' />
      Try our AI Search assistant
    </Label>
    <div className="flex gap-2">
      <Input placeholder='I want a 3 bedroom house in...' />
      <Button className="w-40">Search</Button>
    </div>
  </div>
}
