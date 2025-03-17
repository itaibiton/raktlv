import { create } from 'zustand';

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
        coordinates: [34.78057, 32.08088],
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