import { DialogTrigger } from "./ui/dialog"
import { Database } from "@/schema"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Heart, Eye, BedDouble, Square, Calendar, ArrowLeft, Building2, ArrowRight, AirVent, Warehouse, Car, Dog, Shield, Mail, Phone, User, Home, Info } from "lucide-react"
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
import { Badge } from "@/components/ui/badge";

// Add a helper function to format dates in Hebrew style
const formatHebrewDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    // Format as DD/MM/YYYY which is common in Israel
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const PropertyContent = ({ property, dictionary }: {
    property: Database["public"]["Tables"]["properties"]["Row"],
    dictionary: any
}) => {

    const { updateFilter } = useFilterStore()

    const amenities = [
        { key: 'air_conditioner', icon: <AirVent className="w-4 h-4" />, label: 'מיזוג' },
        { key: 'elevator', icon: <Building2 className="w-4 h-4" />, label: 'מעלית' },
        { key: 'parking', icon: <Car className="w-4 h-4" />, label: 'חניה' },
        { key: 'pet_friendly', icon: <Dog className="w-4 h-4" />, label: 'חיות מחמד' },
        { key: 'protected_space', icon: <Shield className="w-4 h-4" />, label: 'ממ״ד' },
        { key: 'warehouse', icon: <Warehouse className="w-4 h-4" />, label: 'מחסן' },
    ];

    return (
        <CardContent className="gap-4 flex flex-col pt-4 relative">

            {/* Main Property Info */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">{property.title}</h2>
                    <p className="text-lg text-muted-foreground">
                        {property.propertydefinition} ב{property.place_name}
                    </p>
                </div>

                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                            {dictionary?.filterForm[property.type as keyof typeof dictionary.filterForm]}
                        </p>
                        <p className="text-2xl font-bold">
                            {formatPrice(property.price || 0, property.type)}
                        </p>
                    </div>

                    <Badge variant="secondary" className="text-lg">
                        {property.condition === 'new' ? 'חדש' : 'יד שניה'}
                    </Badge>
                </div>
            </div>

            <Separator />

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4">
                {property.bedrooms && (
                    <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5" />
                        <span>{property.bedrooms} חדרים</span>
                    </div>
                )}
                {property.square_feet && (
                    <div className="flex items-center gap-2">
                        <Square className="w-5 h-5" />
                        <span>{property.square_feet} מ״ר</span>
                    </div>
                )}
                {property.floor && (
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <span>קומה {property.floor}</span>
                    </div>
                )}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">מאפיינים</h3>
                <div className="flex flex-wrap gap-2">
                    {amenities.map(({ key, icon, label }) => (
                        property[key as keyof typeof property] && (
                            <Badge key={key} variant="outline" className="flex items-center gap-2 py-2">
                                {icon}
                                {label}
                            </Badge>
                        )
                    ))}
                </div>
            </div>

            {/* Entry Dates */}
            {property.entry_date_from && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">תאריכי כניסה</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-5 h-5" />
                        <span className="flex items-center gap-2">
                            {formatHebrewDate(property.entry_date_from)}
                            {property.type === 'sublet' && property.entry_date_to && (
                                <>
                                    <ArrowLeft className="w-4 h-4" />
                                    {formatHebrewDate(property.entry_date_to)}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            )}

            {/* Description */}
            {property.description && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">תיאור הנכס</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                        {property.description}
                    </p>
                </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4 bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold">פרטי התקשרות</h3>
                <div className="space-y-2">
                    {property.contact_full_name && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{property.contact_full_name}</span>
                        </div>
                    )}
                    {property.contact_phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${property.contact_phone}`} className="text-primary">
                                {property.contact_phone}
                            </a>
                        </div>
                    )}
                    {property.contact_email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${property.contact_email}`} className="text-primary">
                                {property.contact_email}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        </CardContent>
    );
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
        <div className="flex flex-col w-2/3 relative justify-start">
            <Card className="overflow-y-auto scrollbar-hide relative">
                <CardHeader className="p-0 rounded-t-lg overflow-hidden">
                    <PropertyCarousel photos={photos} propertyId={property.property_id} isFirstImageAnimated={true} />
                </CardHeader>

                <PropertyContent property={property} dictionary={dictionary} />

            </Card>
            <Button
                className="flex gap-2 p-0 max-w-fit mt-4"
                variant="link"
                onClick={() => updateFilter("selectedProperty", null)}
            >
                <ArrowRight className="w-4 h-4" />
                {dictionary?.filterForm.back ?? "חזור"}
            </Button>
        </div>
    );
};

export default SelectedProperty