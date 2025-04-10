import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Loader2, X } from "lucide-react";
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
import { Button } from "./button";

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
    onClear?: () => void;
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
    onClear,
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

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            onSelectedValueChange("" as T);
            onSearchValueChange("");
        }
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget?.hasAttribute("cmdk-list")) {
            return;
        }
    };

    const onSelectItem = (inputValue: string) => {
        if (inputValue === selectedValue) {
            setOpen(false);
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
        <div className="flex items-center relative">
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
                                className="pr-8"
                            />
                        </CommandPrimitive.Input>
                    </PopoverAnchor>
                    {searchValue && (
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={handleClear}
                            className="absolute left-0 top-0 h-10 w-10 p-0"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear</span>
                        </Button>
                    )}
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