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

export interface FilterType {
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
}

interface FilterSidebarProps {
    filters: FilterType;
    onChange: (filters: FilterType) => void;
}

const FilterSidebar = () => {
    const [filters, setFilters] = useState<FilterType>({
        propertyType: "all",
        minPrice: 0,
        maxPrice: 5000000,
        bedrooms: 0,
        bathrooms: 0,
    });


    const updateFilter = (key: keyof FilterType, value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    return <div className="border border-b-0 rounded-md hidden md:flex flex-col w-96 h-full">
        <div className="flex-1 overflow-y-auto">
            <FilterItems filters={filters} updateFilter={updateFilter} />
        </div>
        <Button
            size="lg"
            className="w-full text-base" onClick={() =>
                setFilters({
                    propertyType: "all",
                    minPrice: 0,
                    maxPrice: 5000000,
                    bedrooms: 0,
                    bathrooms: 0,
                })
            }>
            Reset Filters
        </Button>
    </div>

}


export default FilterSidebar



const FilterItems = ({ filters, updateFilter }: { filters: FilterType, updateFilter: (key: keyof FilterType, value: any) => void }) => {
    return <div className="p-4 flex flex-col overflow-y-auto gap-6 pb-12">
        <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium text-real-600">Property Type</label>
            <ToggleGroup type="multiple" variant="outline" className='w-full'>
                <ToggleGroupItem className='w-full' value="bold" aria-label="Toggle bold">
                    Rental
                </ToggleGroupItem>
                <ToggleGroupItem className='w-full' value="italic" aria-label="Toggle italic">
                    Sale
                </ToggleGroupItem>
                <ToggleGroupItem className='w-full' value="strikethrough" aria-label="Toggle strikethrough">
                    Sublet
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-real-600">Price Range</label>
            <div className="pt-2">
                <Slider
                    defaultValue={[10000]}
                    max={10000}
                    step={100}
                />
            </div>
            <div className="flex justify-between text-sm text-real-500">
                <span>$0</span>
                <span>$10,000</span>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-real-600">Bedrooms</label>
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
            <label className="text-sm font-medium text-real-600">Bathrooms</label>
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
        <div className="space-y-2">
            <label className="text-sm font-medium text-real-600">Bathrooms</label>
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
        <div className="space-y-2">
            <label className="text-sm font-medium text-real-600">Bathrooms</label>
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
        <div className="space-y-2">
            <label className="text-sm font-medium text-real-600">Bathrooms</label>
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
}