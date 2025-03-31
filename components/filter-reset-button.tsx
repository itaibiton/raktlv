"use client"

import { useFilterStore } from '@/store/filter-store';
import { Button } from '@/components/ui/button';

export function FilterResetButton() {
    const resetFilters = useFilterStore((state) => state.resetFilters);

    return (
        <Button onClick={resetFilters}>
            נקה סינון
        </Button>
    );
} 