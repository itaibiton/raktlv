import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import clsx from "clsx";
import { FilterType } from "@/store/filter-store";

type Props<T extends string> = {
    selectedValue: T;
    onSelectedValueChange: (value: T) => void;
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    items: { value: T; label: string }[];
    isLoading?: boolean;
    emptyMessage?: string;
    placeholder?: string;
    noResults?: boolean;
    noResultsMessage?: string;
    minCharacters?: number;
    onInputChange?: (value: string) => void;
    filters?: FilterType;
};

export function AutoComplete<T extends string>({
    selectedValue,
    onSelectedValueChange,
    searchValue,
    onSearchValueChange,
    items,
    isLoading,
    emptyMessage = "No items.",
    placeholder = "Search...",
    noResults,
    noResultsMessage,
    minCharacters,
    onInputChange,
    filters,
}: Props<T>) {
    const [open, setOpen] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [inputValue, setInputValue] = useState(searchValue);

    const labels = useMemo(
        () =>
            items.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {} as Record<string, string>),
        [items]
    );

    const reset = () => {
        onSelectedValueChange("" as T);
        onSearchValueChange("");
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (
            !e.relatedTarget?.hasAttribute("cmdk-list") &&
            labels[selectedValue] !== searchValue &&
            !filters?.selectedProperty
        ) {
            reset();
        }
    };

    const onSelectItem = (inputValue: string) => {
        if (inputValue === selectedValue) {
            reset();
        } else {
            onSelectedValueChange(inputValue as T);
            onSearchValueChange(labels[inputValue] ?? "");
        }
        setOpen(false);
    };

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputValue(value);

            if (value.length >= minCharacters!) {
                onInputChange?.(value);
            } else {
                setShowResults(false);
            }
        },
        [minCharacters, onInputChange]
    );

    useEffect(() => {
        if (isLoading) {
            setShowResults(false);
        } else if (items && items.length > 0) {
            setShowResults(true);
        } else if (noResults) {
            setShowResults(true);
        }
    }, [isLoading, items, noResults]);

    return (
        <div className="flex items-center">
            <Popover open={open && (searchValue.trim() !== "" || isLoading)} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <PopoverAnchor asChild>
                        <CommandPrimitive.Input
                            asChild
                            value={searchValue}
                            onValueChange={onSearchValueChange}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!searchValue || !open)}
                            onFocus={() => setOpen(!!searchValue)}
                            onBlur={onInputBlur}
                        >
                            <Input
                                placeholder={placeholder}
                                onChange={handleInputChange}
                            />
                        </CommandPrimitive.Input>
                    </PopoverAnchor>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault();
                            }
                        }}
                        className={`w-[--radix-popover-trigger-width] p-0`}
                    >
                        <CommandList>
                            {isLoading || !showResults ? (
                                <div className="py-6 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : items.length > 0 ? (
                                <CommandGroup>
                                    {items.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onSelect={onSelectItem}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValue === option.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>{noResultsMessage || "No results found."}</CommandEmpty>
                            )}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    );
}