import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";
import { useState, useEffect } from "react";

// const MAX_PRICE = 10000000;
// const MIN_PRICE = 0;

const MIN_PRICE = 0;

const MAX_PRICE = {
    sale: 150000000,
    rental: 20000,
    sublet: 5000
}

const STEP_PRICE = {
    sale: 100000,
    rental: 1000,
    sublet: 100
}

const PropertyPriceFilter = () => {
    const dictionary = useDictionary();
    const { filters, setFilters } = useFilterStore();
    const [minInput, setMinInput] = useState(filters.minPrice?.toString() ?? "0");
    const [maxInput, setMaxInput] = useState(filters.maxPrice?.toString() ?? MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE]?.toString() ?? "0");

    // Format number with commas
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('he-IL').format(num);
    };

    // Parse formatted string back to number
    const parseFormattedNumber = (str: string) => {
        const num = parseInt(str.replace(/[^\d]/g, ''), 10);
        return isNaN(num) ? 0 : num;
    };

    const handleInputChange = (value: string, isMin: boolean) => {
        // Remove any non-digit characters
        const cleanValue = value.replace(/[^\d]/g, '');

        if (isMin) {
            setMinInput(cleanValue);
        } else {
            setMaxInput(cleanValue);
        }
    };

    const switchPropertyPricelabel = (propertyType: string) => {
        if (propertyType === 'rental') {
            return '₪ ש״ח / לחודש';
        } else if (propertyType === 'sale') {
            return '₪ ש״ח';
        } else if (propertyType === 'sublet') {
            return '₪ ש״ח / ללילה';
        }
    }

    const handleInputBlur = (isMin: boolean) => {
        let newMin = parseFormattedNumber(minInput);
        let newMax = parseFormattedNumber(maxInput);

        // Ensure values are within bounds
        newMin = Math.max(MIN_PRICE, Math.min(newMin, MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE]));
        newMax = Math.max(MIN_PRICE, Math.min(newMax, MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE]));

        // Ensure min <= max
        if (newMin > newMax) {
            if (isMin) {
                newMin = newMax;
            } else {
                newMax = newMin;
            }
        }

        // Update both inputs and filters
        setMinInput(newMin.toString());
        setMaxInput(newMax.toString());
        setFilters({
            ...filters,
            minPrice: newMin,
            maxPrice: newMax
        });
    };

    // Update inputs when slider changes
    const handleSliderChange = (values: number[]) => {
        const [newMin, newMax] = values;
        setMinInput(newMin.toString());
        setMaxInput(newMax.toString());
        setFilters({
            ...filters,
            minPrice: newMin,
            maxPrice: newMax
        });
    };

    useEffect(() => {
        // Reset both inputs and filter values when property type changes
        const currentMaxPrice = MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE] ?? MAX_PRICE.rental;

        setMinInput("0");
        setMaxInput(currentMaxPrice.toString());

        // Reset the filter values
        setFilters({
            ...filters,
            minPrice: 0,
            maxPrice: currentMaxPrice
        });
    }, [filters.propertyType, setFilters]);

    return <>
        <label className="text-sm font-medium text-real-600">{dictionary['filterForm'].priceRange}</label>
        <div className="pt-2">
            <Slider
                value={[
                    filters.minPrice ?? 0,
                    filters.maxPrice ?? MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE] ?? MAX_PRICE.rental
                ]}
                onValueChange={handleSliderChange}
                max={MAX_PRICE[filters.propertyType as keyof typeof MAX_PRICE]}
                min={MIN_PRICE}
                step={STEP_PRICE[filters.propertyType as keyof typeof STEP_PRICE]}
                className="my-4"
            />
        </div>
        <div className="flex justify-between gap-4 items-center w-full">
            <div className="relative flex items-center gap-1 w-full">
                <Input
                    type="text"
                    value={formatNumber(parseFormattedNumber(minInput))}
                    onChange={(e) => handleInputChange(e.target.value, true)}
                    onBlur={() => handleInputBlur(true)}
                    className="w-full text-sm text-real-500 text-right pr-6"
                    placeholder="מחיר מינימום"
                />
                <span className="absolute left-2 -bottom-5 text-xs text-real-500">{switchPropertyPricelabel(filters?.propertyType || '')} </span>
            </div>
            <span className="text-sm text-real-500">-</span>
            <div className="relative flex items-center gap-1 w-full">
                <Input
                    type="text"
                    value={formatNumber(parseFormattedNumber(maxInput))}
                    onChange={(e) => handleInputChange(e.target.value, false)}
                    onBlur={() => handleInputBlur(false)}
                    className="w-full text-sm text-real-500 text-right pr-6"
                    placeholder="מחיר מקסימום"
                />
                <span className="absolute left-2 -bottom-5 text-xs text-real-500">{switchPropertyPricelabel(filters?.propertyType || '')} </span>
            </div>
        </div>
    </>;
}

export default PropertyPriceFilter;
