import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";

const BathroomsFilter = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter, setFilters } = useFilterStore();

    return <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].bathrooms}</label>
        <Select
            value={filters?.bathrooms?.toString()}
            onValueChange={(value) => updateFilter("bathrooms", parseInt(value))}
        >
            <SelectTrigger>
                <SelectValue placeholder={dictionary['filterForm'].choose} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0">הכל</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
            </SelectContent>
        </Select>
    </div>
}

export default BathroomsFilter;
