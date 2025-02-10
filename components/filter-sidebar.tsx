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
        <div className="flex md:hidden w-full">
            <Button className="w-full">Filter +</Button>
        </div>
        <div className="border rounded p-4 hidden flex-col gap-6 w-96 md:flex">
            <div className="space-y-2">
                <label className="text-sm font-medium text-real-600">Property Type</label>
                <Select
                    value={filters.propertyType}
                    onValueChange={(value) => updateFilter("propertyType", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                </Select>
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
            <Button
                className="w-full mt-auto"
                onClick={() =>
                    setFilters({
                        propertyType: "all",
                        minPrice: 0,
                        maxPrice: 5000000,
                        bedrooms: 0,
                        bathrooms: 0,
                    })
                }
            >
                Reset Filters
            </Button>
        </div>
    </>

}


export default FilterSidebar