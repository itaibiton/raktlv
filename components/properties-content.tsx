"use client"

import FilterSidebar from "@/components/filter-form/filter-sidebar"
import Map from "@/components/map"
import PropertyList from "@/components/property-list"
import { useFilterStore } from "@/store/filter-store"
import { Database } from "@/schema"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SelectedProperty from "./selected-property"

interface PropertiesContentProps {
    properties: (Database["public"]["Tables"]["properties"]["Row"] & { isLiked: boolean })[]
}

export function PropertiesContent({ properties }: PropertiesContentProps) {
    const { filters, updateFilter } = useFilterStore()
    const selectedProperty = filters.selectedProperty

    return (
        <div className="h-full w-full flex gap-4 flex-col md:flex-row">
            {
                !selectedProperty && (
                    <div className="flex gap-4">
                        <FilterSidebar />
                        <PropertyList properties={properties} />
                    </div>
                )
            }
            {
                selectedProperty && (
                    <SelectedProperty property={selectedProperty} />
                )
            }
            {/* <div className="h-full w-1/3 border">
                <Map properties={properties} />
            </div> */}
        </div>
    )
} 