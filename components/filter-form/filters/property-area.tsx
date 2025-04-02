import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/providers/providers.tsx";
import { useFilterStore } from "@/store/filter-store";
import { useState, useEffect } from "react";

const MIN_AREA = 0;
const MAX_AREA = 500;
const STEP_AREA = 5;

const PropertyAreaFilter = () => {
    const dictionary = useDictionary();
    const { filters, setFilters } = useFilterStore();
    const [minInput, setMinInput] = useState("");
    const [maxInput, setMaxInput] = useState("");

    // Initialize and handle resets
    useEffect(() => {
        if (filters.minArea === undefined && filters.maxArea === undefined) {
            // Handle reset
            setMinInput("0");
            setMaxInput(MAX_AREA.toString());
            setFilters({
                ...filters,
                minArea: MIN_AREA,
                maxArea: MAX_AREA
            });
        } else {
            // Handle normal state
            setMinInput(filters.minArea?.toString() || "0");
            setMaxInput(filters.maxArea?.toString() || MAX_AREA.toString());
        }
    }, [filters.minArea, filters.maxArea]);

    // Format number with commas
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('he-IL').format(num);
    };

    // Parse formatted string back to number
    const parseFormattedNumber = (str: string) => {
        if (!str) return 0;
        const num = parseInt(str.replace(/[^\d]/g, ''), 10);
        return isNaN(num) ? 0 : num;
    };

    const handleInputChange = (value: string, isMin: boolean) => {
        const cleanValue = value.replace(/[^\d]/g, '');
        if (isMin) {
            setMinInput(cleanValue);
        } else {
            setMaxInput(cleanValue);
        }
    };

    const handleInputBlur = (isMin: boolean) => {
        let newMin = parseFormattedNumber(minInput);
        let newMax = parseFormattedNumber(maxInput);

        newMin = Math.max(MIN_AREA, Math.min(newMin, MAX_AREA));
        newMax = Math.max(MIN_AREA, Math.min(newMax, MAX_AREA));

        if (newMin > newMax) {
            if (isMin) {
                newMin = newMax;
            } else {
                newMax = newMin;
            }
        }

        setMinInput(newMin.toString());
        setMaxInput(newMax.toString());
        setFilters({
            ...filters,
            minArea: newMin,
            maxArea: newMax
        });
    };

    const handleSliderChange = (values: number[]) => {
        const [newMin, newMax] = values;
        setMinInput(newMin.toString());
        setMaxInput(newMax.toString());
        setFilters({
            ...filters,
            minArea: newMin,
            maxArea: newMax
        });
    };

    return (
        <>
            <label className="text-sm font-medium text-real-600">
                {dictionary['filterForm'].propertyArea}
            </label>
            <Slider
                value={[
                    parseFormattedNumber(minInput),
                    parseFormattedNumber(maxInput)
                ]}
                onValueChange={handleSliderChange}
                max={MAX_AREA}
                min={MIN_AREA}
                step={STEP_AREA}
                className="my-4"
            />
            <div className="flex justify-between gap-4 items-center w-full">
                <div className="relative flex items-center gap-1 w-full">
                    <Input
                        type="text"
                        value={formatNumber(parseFormattedNumber(minInput))}
                        onChange={(e) => handleInputChange(e.target.value, true)}
                        onBlur={() => handleInputBlur(true)}
                        className="w-full text-sm text-real-500 text-right pr-6"
                        placeholder="שטח מינימלי"
                    />
                    <span className="absolute left-2 -bottom-5 text-xs text-real-500">מ״ר</span>
                </div>
                <span className="text-sm text-real-500">-</span>
                <div className="relative flex items-center gap-1 w-full">
                    <Input
                        type="text"
                        value={formatNumber(parseFormattedNumber(maxInput))}
                        onChange={(e) => handleInputChange(e.target.value, false)}
                        onBlur={() => handleInputBlur(false)}
                        className="w-full text-sm text-real-500 text-right pr-6"
                        placeholder="שטח מקסימלי"
                    />
                    <span className="absolute left-2 -bottom-5 text-xs text-real-500">מ״ר</span>
                </div>
            </div>
        </>
    );
};

export default PropertyAreaFilter; 