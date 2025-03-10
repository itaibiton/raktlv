import { create } from 'zustand';
export interface FilterType {
    propertyType: string[];
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    condition: string;
    floor: number | null;
}


interface FilterState {
    filters: FilterType;
    setFilters: (filters: FilterType) => void;
    updateFilter: <K extends keyof FilterType>(key: K, value: FilterType[K]) => void;
    resetFilters: () => void;
}

const defaultFilters: FilterType = {
    propertyType: [],
    minPrice: 0,
    maxPrice: 5000000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    condition: '',
    floor: null,
};

export const useFilterStore = create<FilterState>((set) => ({
    filters: defaultFilters,
    setFilters: (filters) => set({ filters }),
    updateFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),
    resetFilters: () => set({ filters: defaultFilters }),
}));