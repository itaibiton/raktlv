"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterStore } from "@/store/filter-store";
import { useDictionary } from "@/components/providers/providers.tsx";
import { AutoComplete } from "@/components/ui/autocomplete";

interface SearchFilterProps {
    onResultSelect?: (coordinates: [number, number], placeName: string) => void;
}

export default function SearchFilter({ onResultSelect }: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { updateFilter, filters } = useFilterStore();

    const dictionary = useDictionary();

    // console.log("search-filter--dictionary", dictionary);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        debouncedSearchTerm
                    )}.json?access_token=${accessToken}&country=il&language=he`
                );

                if (!response.ok) throw new Error("Geocoding request failed");

                const data = await response.json();

                setSearchResults(data.features || []);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearchTerm]);

    const handleResultSelect = (resultId: string) => {
        const result = searchResults.find(r => r.id === resultId);
        if (result && result.center) {
            // console.log('Selected location:', result);

            // Check if the location is within bounds (Israel)
            const isWithinBounds = isLocationWithinIsrael(result.center);
            const isWithinTLV = isLocationWithinTelAviv(result.center);

            if (!isWithinTLV) {
                alert("המיקום שנבחר נמצא מחוץ לגבולות ישראל");
                return;
            }

            // console.log('Is within Tel Aviv:', isWithinTLV);

            // Update the filter store with location data
            updateFilter('location', {
                coordinates: result.center as [number, number],
                placeName: result.place_name,
                // isWithinTelAviv: isWithinTLV
            });

            // Also call the callback if provided
            if (onResultSelect) {
                onResultSelect(result.center, result.place_name);
            }
        }
    };

    // Helper function to check if coordinates are within Israel's approximate bounds
    const isLocationWithinIsrael = (coordinates: [number, number]): boolean => {
        // Approximate bounds for Israel [longitude, latitude]
        const minLon = 34.2;
        const maxLon = 35.9;
        const minLat = 29.5;
        const maxLat = 33.3;

        const [lon, lat] = coordinates;

        return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    };

    // Helper function to check if coordinates are within Tel Aviv's approximate bounds
    const isLocationWithinTelAviv = (coordinates: [number, number]): boolean => {
        // Approximate bounds for Tel Aviv [longitude, latitude]
        const minLon = 34.75;
        const maxLon = 34.82;
        const minLat = 32.03;
        const maxLat = 32.13;

        const [lon, lat] = coordinates;

        return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    };

    // Set initial search term if location is already in filters
    useEffect(() => {
        if (filters.location?.placeName && !searchTerm) {
            // setSearchTerm(filters.location.placeName);
        }
    }, [filters.location, searchTerm]);

    const autocompleteItems = searchResults.map(result => ({
        value: result.id,
        label: result.place_name
    }));

    return (
        <div className="relative flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">{dictionary['filterForm']?.location}</label>
            <div className="flex flex-col gap-2" dir="rtl">
                <AutoComplete
                    selectedValue={selectedResultId}
                    onSelectedValueChange={handleResultSelect}
                    searchValue={searchTerm}
                    onSearchValueChange={setSearchTerm}
                    items={autocompleteItems}
                    isLoading={isLoading}
                    noResults={!isLoading && searchResults.length === 0}
                    emptyMessage="לא נמצאו תוצאות"
                    placeholder="חפש מיקום..."
                />
            </div>
        </div>
    );
}