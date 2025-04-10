import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import { Database } from '@/schema';

// Define default map settings as constants that can be imported elsewhere
export const DEFAULT_CENTER: [number, number] = [34.78057, 32.08088]; // Tel Aviv
export const DEFAULT_ZOOM = 12;

type PropertyType = Database["public"]["Enums"]["property_type"];

export type FilterType = {
    location?: {
        coordinates: [number, number];
        placeName: string;
    };
    propertyType: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    selectedProperty?: Database["public"]["Tables"]["properties"]["Row"] | null;
    minArea?: number;
    maxArea?: number;
    propertyDefinitions?: Database["public"]["Enums"]["property_definition"][];
};

const defaultFilters: FilterType = {
    location: {
        coordinates: DEFAULT_CENTER,
        placeName: "תל אביב",
    },
    propertyType: "rental",
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    selectedProperty: null,
    minArea: 0,
    maxArea: 500,
    propertyDefinitions: [],
};

interface FilterState {
    filters: FilterType;
    map: {
        center: [number, number];
        zoom: number;
    };
    updateFilter: <K extends keyof FilterType>(
        key: K,
        value: FilterType[K]
    ) => void;
    resetFilters: () => void;
    setFilters: (filters: FilterType) => void;
    updateMap: (center: [number, number], zoom: number) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filters: defaultFilters,
    map: {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
    },
    updateFilter: (key, value) => {
        if (key === "propertyType" && !value) {
            return;
        }
        set((state) => {
            // Create a new filters object with all existing filters
            const newFilters = { ...state.filters };

            // Special handling for selectedProperty to preserve location
            if (key === 'selectedProperty') {
                if (value === null) {
                    // When deselecting a property, preserve the location
                    delete newFilters[key];
                } else {
                    // When selecting a property, preserve the location
                    newFilters[key] = value;
                }
            } else {
                // For all other filters, update normally
                if (value === null) {
                    delete newFilters[key];
                } else {
                    newFilters[key] = value;
                }
            }

            return {
                filters: newFilters,
                map: state.map
            };
        });
    },
    resetFilters: () => {
        // Reset the store state with default values including zoom
        set({
            filters: defaultFilters,
            map: {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM, // Always use default zoom when resetting
            }
        });

        // Reset URL params
        const url = new URL(window.location.href);
        url.search = ''; // Clear all search params
        window.history.replaceState({}, '', url.toString());
    },
    setFilters: (filters) => set({ filters }),
    updateMap: (center, zoom) =>
        set((state) => ({
            map: {
                ...state.map,
                center,
                zoom,
            },
        })),
}));

// Optional: Create a hook to sync URL with filters
export const useFilterSync = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { filters, setFilters } = useFilterStore();

    // Function to update URL based on filters
    const updateURL = (filters: FilterType) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update or remove each filter parameter
        Object.entries(filters).forEach(([key, value]) => {
            if (value && (
                (Array.isArray(value) && value.length > 0) ||
                (typeof value === 'object' && Object.keys(value).length > 0) ||
                (typeof value === 'number' && value !== 0)
            )) {
                params.set(key, JSON.stringify(value));
            } else {
                params.delete(key);
            }
        });

        // Update the URL without triggering a navigation
        router.replace(`?${params.toString()}`);
    };

    return { updateURL };
};