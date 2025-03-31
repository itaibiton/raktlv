import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';

// Define default map settings as constants that can be imported elsewhere
export const DEFAULT_CENTER: [number, number] = [34.78057, 32.08088]; // Tel Aviv
export const DEFAULT_ZOOM = 12;

export type FilterType = {
    location?: {
        coordinates: [number, number];
        placeName: string;
    };
    propertyType?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
};

const defaultFilters: FilterType = {
    location: {
        coordinates: DEFAULT_CENTER,
        placeName: "Tel Aviv",
    },
    propertyType: [],
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
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
    updateFilter: (key, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        })),
    resetFilters: () => {
        // Reset the store state
        set({
            filters: defaultFilters,
            map: {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
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