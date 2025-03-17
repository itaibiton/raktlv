"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapboxEvent } from "mapbox-gl";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterStore } from "@/store/filter-store";
import { useDictionary } from "@/components/providers/providers.tsx";

interface SearchFilterProps {
    onResultSelect?: (coordinates: [number, number], placeName: string) => void;
}

export default function SearchFilter({ onResultSelect }: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { updateFilter, filters } = useFilterStore();

    const dictionary = useDictionary();


    const [result, setResult] = useState<any[]>([]);

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

    const handleResultClick = (result: any) => {
        if (result.center) {
            // Update the filter store with location data
            updateFilter('location', {
                coordinates: result.center as [number, number],
                placeName: result.place_name
            });

            // Also call the callback if provided
            if (onResultSelect) {
                onResultSelect(result.center, result.place_name);
            }
        }

        setSearchResults([]); // Clear results after selection
    };

    // Set initial search term if location is already in filters
    useEffect(() => {
        if (filters.location?.placeName && !searchTerm) {
            setSearchTerm(filters.location.placeName);
        }
    }, [filters.location]);

    return (
        <div className="relative flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].location}</label>
            <Input
                type="text"
                placeholder="חפש מיקום..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                dir="rtl"
            />

            {isLoading && (
                <div className="absolute top-full mt-1 w-full bg-white p-2 rounded shadow-md z-10">
                    טוען תוצאות...
                </div>
            )}

            {searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white rounded shadow-md z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleResultClick(result)}
                            dir="rtl"
                        >
                            {result.place_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}