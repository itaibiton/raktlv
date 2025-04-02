import { DialogTrigger } from "./ui/dialog"
import { Database } from "@/schema"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Heart, Eye, BedDouble, Square, Calendar, ArrowLeft, Building2, ArrowRight } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import Image from "next/image"
import { useState, useEffect, useTransition, useOptimistic } from "react"
import { Separator } from "./ui/separator"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import { createClient } from "@/utils/supabase/client";
import { useFilterStore } from "@/store/filter-store";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyCarousel } from "@/components/ui/property-carousel";

// Add a helper function to format dates in Hebrew style
const formatHebrewDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    // Format as DD/MM/YYYY which is common in Israel
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const SelectedProperty = ({ property }: { property: Database["public"]["Tables"]["properties"]["Row"] }) => {
    const { filters, updateFilter } = useFilterStore()

    const [imageLoaded, setImageLoaded] = useState(false);

    const dictionary = useDictionary()

    // Format price with currency
    // const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
    const formattedPrice = property.price ? formatPrice(property.price, property.type) : "Price on request";

    // Get first photo for card thumbnail
    const thumbnailImage = property.photos && property.photos.length > 0
        ? property.photos[0]
        : "/placeholder-property.jpg";

    const photos = property.photos || [];

    return (
        <Card className="w-2/3 relative">
            <Button
                className="flex gap-2 p-0 max-w-fit absolute bottom-4 right-4"
                variant="link"
                onClick={() => updateFilter("selectedProperty", null)}
            >
                <ArrowRight className="w-4 h-4" />
                {dictionary?.filterForm.back ?? "חזור"}
            </Button>
            <CardHeader className="p-0 rounded-t-lg overflow-hidden">
                <PropertyCarousel photos={photos} />
            </CardHeader>

            <CardContent className="p-6">


                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-xl">{property.place_name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {property.propertydefinition}, {property.place_name}
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.square_feet} {dictionary?.filterForm.square_feet}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{dictionary?.filterForm.floor} {property.floor}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-end">
                        <span className="flex flex-col gap-1">
                            <p className="text-sm">
                                {dictionary?.filterForm[property.type as keyof typeof dictionary.filterForm]}
                            </p>
                            {property.entry_date_from && (
                                <div className="flex gap-2 text-sm items-center">
                                    <Calendar className="w-4 h-4" />
                                    <span className="flex items-center gap-1">
                                        {formatHebrewDate(property.entry_date_from)}
                                        {property.type === 'sublet' && property.entry_date_to && (
                                            <>
                                                <ArrowLeft className="w-4 h-4" />
                                                {formatHebrewDate(property.entry_date_to)}
                                            </>
                                        )}
                                    </span>
                                </div>
                            )}
                        </span>
                        <p className="font-bold text-xl">
                            {formatPrice(property.price || 0, property.type)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SelectedProperty