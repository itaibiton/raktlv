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
import { useDictionary } from "./providers/providers.tsx";

interface FilterSidebarProps {
    filters: FilterType;
    onChange: (filters: FilterType) => void;
}

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
            </div>

            <div className="space-y-2">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].bathrooms}</label>
                    <Select
                        value={filters.bathrooms.toString()}
                        onValueChange={(value) => updateFilter("bathrooms", parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select bathrooms" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="parking"
                            checked={filters.amenities.includes('parking')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'parking']
                                    : filters.amenities.filter(a => a !== 'parking');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="parking" className="text-sm text-real-600">Parking</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="elevator"
                            checked={filters.amenities.includes('elevator')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'elevator']
                                    : filters.amenities.filter(a => a !== 'elevator');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="elevator" className="text-sm text-real-600">Elevator</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="balcony"
                            checked={filters.amenities.includes('balcony')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'balcony']
                                    : filters.amenities.filter(a => a !== 'balcony');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="balcony" className="text-sm text-real-600">Balcony</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="ac"
                            checked={filters.amenities.includes('air_conditioner')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'air_conditioner']
                                    : filters.amenities.filter(a => a !== 'air_conditioner');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="ac" className="text-sm text-real-600">AC</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="pet_friendly"
                            checked={filters.amenities.includes('pet_friendly')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'pet_friendly']
                                    : filters.amenities.filter(a => a !== 'pet_friendly');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="pet_friendly" className="text-sm text-real-600">Pet Friendly</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="disabled_access"
                            checked={filters.amenities.includes('disabled_access')}
                            onChange={(e) => {
                                const newAmenities = e.target.checked
                                    ? [...filters.amenities, 'disabled_access']
                                    : filters.amenities.filter(a => a !== 'disabled_access');
                                updateFilter("amenities", newAmenities);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="disabled_access" className="text-sm text-real-600">Disabled Access</label>
                    </div>
                </div>
            </div>

        </div>
    );
}

