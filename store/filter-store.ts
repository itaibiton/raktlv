import { create } from 'zustand';

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
    updateFilter: <K extends keyof FilterType>(
        key: K,
        value: FilterType[K]
    ) => void;
    resetFilters: () => void;
    setFilters: (filters: FilterType) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filters: defaultFilters,
    updateFilter: (key, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        })),
    resetFilters: () => set({ filters: defaultFilters }),
    setFilters: (filters) => set({ filters }),
}));