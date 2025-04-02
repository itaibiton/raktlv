import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";
import { Building, Calendar, CalendarIcon, Home, Receipt } from "lucide-react";
import { useEffect } from "react";

const PropertyTypeFilter = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter } = useFilterStore();

    // Ensure a default value is set on mount if none exists
    useEffect(() => {
        if (!filters.propertyType) {
            updateFilter("propertyType", "rental");
        }
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">
                {dictionary?.['filterForm'].propertyType}
            </label>
            <ToggleGroup
                type="single"
                value={filters.propertyType}
                onValueChange={(value) => {
                    // Don't allow deselection
                    if (value) {
                        updateFilter("propertyType", value as "rental" | "sale" | "sublet");
                    }
                }}
                className="flex flex-wrap gap-2 justify-start"
            >
                <ToggleGroupItem
                    value="rental"
                    className="flex items-center justify-start h-auto py-2 px-3"
                >
                    {dictionary?.['filterForm'].rental}
                    <Home className="w-4 h-4" />

                </ToggleGroupItem>
                <ToggleGroupItem
                    value="sale"
                    className="flex items-center justify-start h-auto py-2 px-3"
                >
                    {dictionary?.['filterForm'].sale}
                    <Receipt className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="sublet"
                    className="flex items-center justify-start h-auto py-2 px-3"
                >
                    {dictionary?.['filterForm'].sublet}
                    <Building className="w-4 h-4" />

                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default PropertyTypeFilter;
