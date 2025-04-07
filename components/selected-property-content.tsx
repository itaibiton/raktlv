import { Database } from "@/schema";
import { useFilterStore } from "@/store/filter-store";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AirVent, ArrowLeft, BedDouble, Building2, Calendar, Car, Dog, Mail, Phone, Shield, Square, User, Warehouse } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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

    // Format price with currency
    // const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
    const formattedPrice = property.price ? formatPrice(property.price, property.type) : "Price on request";

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
            <div className="flex flex-col">
                <p className="text-2xl font-semibold">
                    {property.place_name}, {property.type}
                </p>
            </div>

            {/* <div className="space-y-4">
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

            {property.description && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">תיאור הנכס</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                        {property.description}
                    </p>
                </div>
            )}

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
            </div> */}
        </CardContent>
    );
};


export default PropertyContent