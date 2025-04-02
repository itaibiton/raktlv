'use client';

import { Button } from "@/components/ui/button";
import { FilterIcon, FilterX, FilterXIcon, Trash2 } from "lucide-react";
import { FilterType, useFilterStore } from "@/store/filter-store";
import { useDictionary } from "@/providers/providers.tsx";
import PropertyTypeFilter from "./filters/property-type";
import PropertyPriceFilter from "./filters/property-price";
import BedroomsFilter from "./filters/bedrooms-filter";
import BathroomsFilter from "./filters/bathrooms-filter";
import { AmenitiesFilter } from "./filters/amenities-filter";
import SearchFilter from "./filters/search";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";


const FilterSidebar = () => {

    const dictionary = useDictionary();

    // console.log("filter-sidebar--dictionary", dictionary);

    const { filters, updateFilter, resetFilters, setFilters } = useFilterStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Sync URL params to filter store on initial load
    useEffect(() => {
        const urlFilters: Partial<FilterType> = {};

        // Parse URL parameters into filter object
        if (searchParams.has('propertyType')) {
            urlFilters.propertyType = searchParams.get('propertyType') || '';
        }

        if (searchParams.has('minPrice')) {
            urlFilters.minPrice = Number(searchParams.get('minPrice')) || undefined;
        }

        if (searchParams.has('maxPrice')) {
            urlFilters.maxPrice = Number(searchParams.get('maxPrice')) || undefined;
        }

        if (searchParams.has('bedrooms')) {
            urlFilters.bedrooms = Number(searchParams.get('bedrooms')) || undefined;
        }

        if (searchParams.has('bathrooms')) {
            urlFilters.bathrooms = Number(searchParams.get('bathrooms')) || undefined;
        }

        if (searchParams.has('amenities')) {
            urlFilters.amenities = searchParams.get('amenities')?.split(',') || [];
        }

        if (searchParams.has('location')) {
            try {
                const locationData = JSON.parse(searchParams.get('location') || '{}');
                if (locationData.coordinates && locationData.placeName) {
                    urlFilters.location = locationData;
                }
            } catch (e) {
                console.error('Failed to parse location data from URL');
            }
        }

        // Only update if there are filters in the URL
        if (Object.keys(urlFilters).length > 0) {
            setFilters(urlFilters);
        }
    }, []);

    // Sync filter store to URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Clear existing filter params
        ['propertyType', 'minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'amenities', 'location'].forEach(param => {
            params.delete(param);
        });

        // Add current filters to URL
        if (filters.propertyType?.length) {
            params.set('propertyType', filters.propertyType.toString());
        }

        if (filters.minPrice) {
            params.set('minPrice', filters.minPrice.toString());
        }

        if (filters.maxPrice) {
            params.set('maxPrice', filters.maxPrice.toString());
        }

        if (filters.bedrooms) {
            params.set('bedrooms', filters.bedrooms.toString());
        }

        if (filters.bathrooms) {
            params.set('bathrooms', filters.bathrooms.toString());
        }

        if (filters.amenities?.length) {
            params.set('amenities', filters.amenities.join(','));
        }

        if (filters.location) {
            params.set('location', JSON.stringify(filters.location));
        }

        // Update URL without refreshing the page
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [filters, pathname, router]);

    return (
        <>
            <div className="md:hidden w-full">
                <Button variant="outline" className="text-muted-foreground">
                    <FilterIcon className="w-5 h-5" />
                </Button>
            </div>
            <div className="border rounded-md hidden md:flex flex-col min-w-96 h-full overflow-y-auto">
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <FilterItems />
                </div>
                <div className="flex bg-background p-4 justify-between items-center border-t">
                    <Button onClick={resetFilters} variant="outline" size="sm" className="text-muted-foreground">
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

    // Handle location selection from search
    const handleLocationSelect = (coordinates: [number, number], placeName: string) => {
        updateFilter('location', { coordinates, placeName });
    };

    return (
        <div className="p-4 flex flex-col overflow-y-auto gap-6 pb-12">
            <div className="flex w-full flex-col gap-2">
                <SearchFilter onResultSelect={handleLocationSelect} />
            </div>
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

