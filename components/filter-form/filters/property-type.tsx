import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";

const PropertyTypeFilter = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter } = useFilterStore();

    return <>
        <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].propertyType}</label>
        <ToggleGroup type="multiple" variant="outline" className='w-full gap-2'
            value={filters.propertyType}
            onValueChange={(value) => updateFilter("propertyType", value)}
        >
            <ToggleGroupItem className='w-full' value="rental" aria-label={dictionary['filterForm'].rental}>
                {dictionary['filterForm'].rental}
            </ToggleGroupItem>
            <ToggleGroupItem className='w-full' value="for sale" aria-label={dictionary['filterForm'].sale}>
                {dictionary['filterForm'].sale}
            </ToggleGroupItem>
            <ToggleGroupItem className='w-full' value="sublet" aria-label={dictionary['filterForm'].sublet}>
                {dictionary['filterForm'].sublet}
            </ToggleGroupItem>

        </ToggleGroup>
    </>
}

export default PropertyTypeFilter;
