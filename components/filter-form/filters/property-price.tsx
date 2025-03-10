import { Slider } from "@/components/ui/slider";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";

const PropertyPriceFilter = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter, setFilters } = useFilterStore();

    return <>
        <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].priceRange}</label>
        <div className="pt-2">
            <Slider
                defaultValue={[0, 5000000]}
                onValueChange={(values) => {
                    const minPrice = Math.min(values[0], values[1]);
                    const maxPrice = Math.max(values[0], values[1]);
                    setFilters({
                        ...filters,
                        minPrice,
                        maxPrice
                    });
                }}
                max={50000000}
                min={0}
                step={10000}
            />
        </div>
        <div className="flex justify-between text-sm text-real-500">
            <span>₪{filters.minPrice.toLocaleString()}</span>
            <span>₪{filters.maxPrice.toLocaleString()}</span>
        </div>
    </>
}

export default PropertyPriceFilter;
