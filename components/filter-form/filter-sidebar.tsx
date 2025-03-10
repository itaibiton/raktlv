'use client';

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { FilterIcon, FilterX, FilterXIcon, Trash2 } from "lucide-react";
import { FilterType, useFilterStore } from "@/store/filter-store";
import { useDictionary } from "@/providers/providers.tsx";
import PropertyTypeFilter from "./filters/property-type";
import PropertyPriceFilter from "./filters/property-price";
import BedroomsFilter from "./filters/bedrooms-filter";
import BathroomsFilter from "./filters/bathrooms-filter";
import { AmenitiesFilter } from "./filters/amenities-filter";


const FilterSidebar = () => {
    return (
        <>
            <div className="md:hidden w-full">
                <Button variant="outline" className="text-muted-foreground">
                    <FilterIcon className="w-5 h-5" />
                </Button>
            </div>
            <div className="border rounded-md hidden md:flex flex-col w-96 h-full overflow-y-auto ">
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <FilterItems />
                </div>
                <div className="flex bg-background p-4 justify-between items-center border-t">
                    <Button variant="outline" size="sm" className="text-muted-foreground">
                        <FilterXIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default FilterSidebar

const FilterItems = () => {
    const dictionary = useDictionary();
    const { filters, updateFilter, resetFilters, setFilters } = useFilterStore();


    return (
        <div className="p-4 flex flex-col overflow-y-auto gap-6 pb-12">
            <div className="flex w-full flex-col gap-2">
                <PropertyTypeFilter />
            </div>
            <div className="flex w-full flex-col gap-2">
                <PropertyPriceFilter />
            </div>
            <div className="flex w-full gap-2">
                <BedroomsFilter />
                <BathroomsFilter />
            </div>
            <div className="flex w-full">
                <AmenitiesFilter />
            </div>
        </div>
    );
}

