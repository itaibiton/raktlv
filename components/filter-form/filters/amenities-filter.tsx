import React from 'react';
import {
    AirVent,
    Building2,
    Car,
    Dog,
    Shield,
    Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type AmenityOption = {
    id: string;
    label: string;
    icon: React.ReactNode;
};

const amenityOptions: AmenityOption[] = [
    { id: 'air_conditioner', label: 'AC', icon: <AirVent className="h-4 w-4 mr-2" /> },
    { id: 'elevator', label: 'Elevator', icon: <Building2 className="h-4 w-4 mr-2" /> },
    { id: 'parking', label: 'Parking', icon: <Car className="h-4 w-4 mr-2" /> },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: <Dog className="h-4 w-4 mr-2" /> },
    { id: 'protected_space', label: 'Protected', icon: <Shield className="h-4 w-4 mr-2" /> },
    { id: 'warehouse', label: 'Storage', icon: <Warehouse className="h-4 w-4 mr-2" /> },
];

export function AmenitiesFilter() {
    const dictionary = useDictionary();
    const { filters, updateFilter } = useFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">{dictionary?.['filterForm']?.amenities}</label>
            <ToggleGroup
                type="multiple"
                variant="outline"
                className="flex flex-wrap gap-2 justify-start"
                value={filters.amenities}
                onValueChange={(value) => updateFilter("amenities", value)}
            >
                {amenityOptions.map((option) => (
                    <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        className="flex items-center justify-start h-auto py-2 px-3"
                        aria-label={dictionary?.['filterForm']?.[option.id] || option.label}
                    >
                        {option.icon}
                        <span>{dictionary?.['filterForm']?.[option.id] || option.label}</span>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}
