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

    return <>
        <div className="md:hidden w-full">
            <Button variant="outline" className="text-muted-foreground">
                <FilterIcon className="w-5 h-5" />
            </Button>
        </div>
        <div className="border rounded-md hidden md:flex flex-col w-96 h-full overflow-y-auto ">
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <FilterItems filters={filters} updateFilter={updateFilter} />
            </div>
            {/* <div className="flex bg-white p-4 shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.1)] justify-between items-center"> */}
            <div className="flex bg-background p-4 justify-between items-center border-t">
                <Button variant="outline" size="sm" className="text-muted-foreground">
                    <FilterXIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    </>

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

