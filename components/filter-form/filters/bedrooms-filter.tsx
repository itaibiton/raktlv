import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";

const BedroomsFilter = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter, setFilters } = useFilterStore();

    return <div className="flex w-full flex-col">
        <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].bedrooms}</label>
        <Select
            value={filters.bedrooms.toString()}
            onValueChange={(value) => updateFilter("bedrooms", parseInt(value))}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
            </SelectContent>
        </Select>
    </div>
}

export default BedroomsFilter;
