import { DialogTrigger } from "./ui/dialog"
import { Database } from "@/schema"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Heart, Eye, BedDouble, Square, Calendar, ArrowLeft } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import Image from "next/image"
import { useState } from "react"
import { Separator } from "./ui/separator"
import { formatPrice } from "@/lib/utils"


// Add a helper function to format dates in Hebrew style
const formatHebrewDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    // Format as DD/MM/YYYY which is common in Israel
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export default function PropertyModalTrigger({ property, onClick }: { property: Database["public"]["Tables"]["properties"]["Row"], onClick?: () => void }) {
    const { dictionary } = useDictionary();
    const [imageLoaded, setImageLoaded] = useState(false);


    // Format price with currency
    // const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
    const formattedPrice = property.price ? formatPrice(property.price, property.type) : "Price on request";

    // Get first photo for card thumbnail
    const thumbnailImage = property.photos && property.photos.length > 0
        ? property.photos[0]
        : "/placeholder-property.jpg";
    return (
        <DialogTrigger asChild
            onClick={onClick}
        >
            <Card className="group h-full overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col">
                <CardContent className="w-full h-full flex flex-col pb-4 px-0 gap-4 relative">
                    <div className="absolute top-2 left-2 z-10 flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white"
                            onClick={(e) => { e.stopPropagation() }}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white"
                            onClick={(e) => { e.stopPropagation() }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative min-h-48 w-full overflow-hidden">
                        <Image
                            src={thumbnailImage}
                            alt={property.title || "Property image"}
                            fill
                            className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}
                    </div>
                    <div className="px-4">
                        <h3 className="font-bold">{property.place_name}</h3>
                        {/* Todo: add location */}
                        <p className="text-sm text-muted-foreground">דירה , תל אביב , הטיילת</p>
                    </div>
                    <div className="flex justify-between items-center px-4">
                        <div className="flex gap-4 text-sm text-muted-foreground w-full">
                            <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                <span>{property.square_feet} {dictionary?.filterForm.square_feet}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                <span>{dictionary?.filterForm.floor} {property.floor}</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-end px-4">
                        <span className="flex flex-col gap-1">
                            <p className="text-sm">{dictionary?.filterForm[property.type as keyof typeof dictionary.filterForm]}</p>
                            {property.type === 'sublet' &&
                                <div className="flex gap-2  text-sm items-center">
                                    <Calendar className="w-4 h-4" />
                                    <span className="flex items-center gap-1">
                                        {formatHebrewDate(property.entry_date_from!)}
                                        <ArrowLeft className="w-4 h-4" /> {formatHebrewDate(property.entry_date_to!)}
                                    </span>
                                </div>
                            }
                            {property.type === 'rental' &&
                                <div className="flex gap-2  text-sm items-center">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatHebrewDate(property.entry_date_from!)}</span>
                                </div>
                            }
                            {property.type === 'for sale' &&
                                <div className="flex gap-2  text-sm items-center">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatHebrewDate(property.entry_date_from!)}</span>
                                </div>
                            }
                        </span>
                        <p className="font-bold text-sm">{formattedPrice}</p>
                    </div>
                </CardContent>
            </Card>
        </DialogTrigger>
    )
}