import React from 'react';
import {
    Building,
    Home,
    Building2,
    Warehouse,
    ParkingCircle,
    Trees,
    Hotel,
    HomeIcon,
    PenTool,
    Box,
    DoorClosed,
    Store,
    CircleDot,
    House
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Database } from '@/schema';

type DefinitionOption = {
    id: Database["public"]["Enums"]["property_definition"];
    icon: React.ReactNode;
};

const definitionOptions: DefinitionOption[] = [
    { id: "דירה", icon: <Building className="h-4 w-4 mr-2" /> },
    { id: "דירת גן", icon: <House className="h-4 w-4 mr-2" /> },
    { id: "גג/פנטהאוז", icon: <PenTool className="h-4 w-4 mr-2" /> },
    { id: "דופלקס", icon: <Building2 className="h-4 w-4 mr-2" /> },
    { id: "מרתף", icon: <Box className="h-4 w-4 mr-2" /> },
    { id: "טריפלקס", icon: <Building2 className="h-4 w-4 mr-2" /> },
    { id: "יחידת דיור", icon: <DoorClosed className="h-4 w-4 mr-2" /> },
    { id: "בית פרטי/קוטג", icon: <Home className="h-4 w-4 mr-2" /> },
    { id: "דו משפחתי", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
    { id: "משק חקלאי / נחלה", icon: <Trees className="h-4 w-4 mr-2" /> },
    { id: "מגרשים", icon: <CircleDot className="h-4 w-4 mr-2" /> },
    { id: "דיור מוגן", icon: <Building className="h-4 w-4 mr-2" /> },
    { id: "בנין מגורים", icon: <Hotel className="h-4 w-4 mr-2" /> },
    { id: "מחסן", icon: <Warehouse className="h-4 w-4 mr-2" /> },
    { id: "חניה", icon: <ParkingCircle className="h-4 w-4 mr-2" /> },
    { id: "כללי", icon: <Store className="h-4 w-4 mr-2" /> },
];

export function PropertyDefinitionFilter() {
    const dictionary = useDictionary();
    const { filters, updateFilter } = useFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-real-600">
                {dictionary?.['filterForm']?.propertyDefinition}
            </label>
            <ToggleGroup
                type="multiple"
                variant="outline"
                className="flex flex-wrap gap-2 justify-start"
                value={filters.propertyDefinitions}
                onValueChange={(value) => updateFilter("propertyDefinitions", value as Database["public"]["Enums"]["property_definition"][])}
            >
                {definitionOptions.map((option) => (
                    <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        className="flex items-center justify-start h-auto py-2 px-3"
                        aria-label={dictionary?.['filterForm']?.[option.id] || option.id}
                    >
                        {option.icon}
                        <span>{dictionary?.['filterForm']?.[option.id] || option.id}</span>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
} 