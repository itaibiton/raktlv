"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterStore } from "@/store/filter-store";
import { useDictionary } from "@/components/providers/providers.tsx";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useMapStore, DEFAULT_ZOOM } from "@/store/map-store";

interface SearchFilterProps {
    onResultSelect?: (coordinates: [number, number], placeName: string) => void;
}

export default function SearchFilter({ onResultSelect }: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { updateFilter, filters } = useFilterStore();

    const dictionary = useDictionary();

    // console.log("search-filter--dictionary", dictionary);

    // Set initial search term if location is already in filters, but only once
    useEffect(() => {
        if (!isInitialized && filters.location?.placeName) {
            setSearchTerm(filters.location.placeName);
            setIsInitialized(true);
        }
    }, [filters.location, isInitialized]);

    // Preserve search term when a property is selected or deselected
    useEffect(() => {
        if (filters.location?.placeName) {
            setSearchTerm(filters.location.placeName);
        }
    }, [filters.selectedProperty, filters.location]);

    // Handle search term changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);

        // Only clear the location filter if the user explicitly clears the search
        // We'll let the selection process handle setting the location
    };

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

    const autocompleteItems = searchResults.map(result => ({
        value: result.id,
        label: result.place_name
    }));

    // Handle explicit search clearing (like with an X button or clear action)
    const handleClearSearch = () => {
        setSearchTerm("");
        setSelectedResultId("");

        // Get the default location and update the filter
        const defaultLocation = {
            coordinates: [34.78057, 32.08088] as [number, number],
            placeName: "תל אביב"
        };

        // Update the filter with the default location
        updateFilter('location', defaultLocation);

        // Reset the map to default center and zoom
        // We can access the map store directly to reset it
        const mapInstance = useMapStore.getState().mapInstance;
        if (mapInstance) {
            mapInstance.easeTo({
                center: defaultLocation.coordinates,
                zoom: DEFAULT_ZOOM,
                duration: 1000
            });
        }
    };

    return (
        <div className="relative flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">{dictionary['filterForm']?.location}</label>
            <div className="flex flex-col gap-2" dir="rtl">
                <AutoComplete
                    selectedValue={selectedResultId}
                    onSelectedValueChange={handleResultSelect}
                    searchValue={searchTerm}
                    onSearchValueChange={handleSearchChange}
                    items={autocompleteItems}
                    isLoading={isLoading}
                    noResults={!isLoading && searchResults.length === 0}
                    emptyMessage="לא נמצאו תוצאות"
                    placeholder="חפש מיקום..."
                    filters={filters}
                    onClear={handleClearSearch}
                />
            </div>
        </div>
    );
}