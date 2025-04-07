"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useDebounce } from "@/hooks/use-debounce";
import { Database } from "@/schema";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyCarousel } from "@/components/ui/property-carousel";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

const formSchema = z.object({
    title: z.string().min(2, "כותרת חייבת להכיל לפחות 2 תווים"),
    description: z.string().optional(),
    price: z.number().min(0, "מחיר חייב להיות חיובי"),
    bedrooms: z.number().min(0, "מספר חדרים חייב להיות חיובי"),
    square_feet: z.number().min(0, "גודל הדירה חייב להיות חיובי"),
    floor: z.number().min(-1, "קומה חייבת להיות גדולה מ -1"),
    condition: z.enum(["new", "used"]),
    propertydefinition: z.enum([
        "דירה",
        "דירת גן",
        "גג/פנטהאוז",
        "דופלקס",
        "מרתף",
        "טריפלקס",
        "יחידת דיור",
        "בית פרטי/קוטג",
        "דו משפחתי",
        "משק חקלאי / נחלה",
        "מגרשים",
        "דיור מוגן",
        "בנין מגורים",
        "מחסן",
        "חניה",
        "כללי"
    ]),
    entry_date_from: z.string().optional(),
    entry_date_to: z.string().optional(),
    contact_full_name: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
    contact_phone: z.string().min(9, "מספר טלפון חייב להכיל לפחות 9 ספרות"),
    contact_email: z.string().email("אימייל לא תקין"),
    air_conditioner: z.boolean().optional(),
    balcony: z.boolean().optional(),
    disabled_access: z.boolean().optional(),
    elevator: z.boolean().optional(),
    parking: z.boolean().optional(),
    pet_friendly: z.boolean().optional(),
    protected_space: z.boolean().optional(),
    warehouse: z.boolean().optional(),
    place_name: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    mapbox_data: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RentalForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();
    const { user } = useUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            bedrooms: 0,
            square_feet: 0,
            floor: 0,
            condition: "used",
            propertydefinition: "דירה",
            air_conditioner: false,
            balcony: false,
            disabled_access: false,
            elevator: false,
            parking: false,
            pet_friendly: false,
            protected_space: false,
            warehouse: false,
        },
    });

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setIsUploading(true);
        try {
            for (const file of Array.from(files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('properties')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(filePath);

                setPhotos(prev => [...prev, publicUrl]);
            }
            toast("התמונות הועלו בהצלחה");
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast("שגיאה בהעלאת התמונות");
        } finally {
            setIsUploading(false);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormValues) => {
        if (!user) {
            toast("יש להתחבר כדי לפרסם נכס");
            return;
        }

        try {
            const { error } = await supabase
                .from('properties')
                .insert({
                    ...data,
                    type: 'rental' as Database["public"]["Enums"]["property_type"],
                    photos,
                    user_id: user.id
                });

            if (error) throw error;

            toast("הנכס נוסף בהצלחה");
        } catch (error) {
            console.error('Error submitting form:', error);
            toast("שגיאה בשמירת הנכס");
        }
    };

    // Handle location search
    const handleLocationSearch = async () => {
        if (!debouncedSearchTerm) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    debouncedSearchTerm
                )}.json?access_token=${accessToken}&country=il&language=he`
            );

            if (!response.ok) throw new Error("Geocoding request failed");

            const data = await response.json();
            setSearchResults(data.features || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Update search results when debounced search term changes
    React.useEffect(() => {
        handleLocationSearch();
    }, [debouncedSearchTerm]);

    const handleResultSelect = (resultId: string) => {
        const result = searchResults.find(r => r.id === resultId);
        if (result && result.center) {
            form.setValue('place_name', result.place_name);
            form.setValue('latitude', result.center[1]);
            form.setValue('longitude', result.center[0]);
            form.setValue('mapbox_data', result);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>כותרת</FormLabel>
                                    <FormControl>
                                        <Input placeholder="כותרת הנכס" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>תיאור</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="תיאור הנכס" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>מחיר</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>חדרים</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="square_feet"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>גודל במ״ר</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="floor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>קומה</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Property Type and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="propertydefinition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>סוג נכס</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="בחר סוג נכס" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="דירה">דירה</SelectItem>
                                        <SelectItem value="דירת גן">דירת גן</SelectItem>
                                        <SelectItem value="גג/פנטהאוז">גג/פנטהאוז</SelectItem>
                                        <SelectItem value="דופלקס">דופלקס</SelectItem>
                                        <SelectItem value="מרתף">מרתף</SelectItem>
                                        <SelectItem value="טריפלקס">טריפלקס</SelectItem>
                                        <SelectItem value="יחידת דיור">יחידת דיור</SelectItem>
                                        <SelectItem value="בית פרטי/קוטג">בית פרטי/קוטג</SelectItem>
                                        <SelectItem value="דו משפחתי">דו משפחתי</SelectItem>
                                        <SelectItem value="משק חקלאי / נחלה">משק חקלאי / נחלה</SelectItem>
                                        <SelectItem value="מגרשים">מגרשים</SelectItem>
                                        <SelectItem value="דיור מוגן">דיור מוגן</SelectItem>
                                        <SelectItem value="בנין מגורים">בנין מגורים</SelectItem>
                                        <SelectItem value="מחסן">מחסן</SelectItem>
                                        <SelectItem value="חניה">חניה</SelectItem>
                                        <SelectItem value="כללי">כללי</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>מצב הנכס</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="בחר מצב נכס" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="new">חדש</SelectItem>
                                        <SelectItem value="used">משופץ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Location Search */}
                <div className="space-y-4">
                    <FormLabel>מיקום</FormLabel>
                    <AutoComplete
                        selectedValue={selectedResultId}
                        onSelectedValueChange={handleResultSelect}
                        searchValue={searchTerm}
                        onSearchValueChange={setSearchTerm}
                        items={searchResults.map(result => ({
                            value: result.id,
                            label: result.place_name
                        }))}
                        isLoading={isLoading}
                        noResults={!isLoading && searchResults.length === 0}
                        emptyMessage="לא נמצאו תוצאות"
                        placeholder="חפש מיקום..."
                    />
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                    <FormLabel>מאפיינים</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="air_conditioner"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">מיזוג</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="balcony"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">מרפסת</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="elevator"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">מעלית</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parking"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">חניה</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pet_friendly"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">חיות מחמד</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="protected_space"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">ממ״ד</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="warehouse"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">מחסן</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="disabled_access"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="mr-2">גישה לנכים</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                    <FormLabel>תמונות</FormLabel>
                    <div className="grid grid-cols-1 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="photo-upload" className="w-full cursor-pointer">
                                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors">
                                            {isUploading ? (
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            ) : (
                                                <>
                                                    <ImagePlus className="h-8 w-8 mb-2" />
                                                    <p className="text-sm">לחץ להעלאת תמונות</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {photos.length > 0 && (
                            <Card>
                                <CardContent className="p-4">
                                    <PropertyCarousel photos={photos} />
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {photos.map((photo, index) => (
                                            <Button
                                                key={index}
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removePhoto(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="contact_full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>שם מלא</FormLabel>
                                <FormControl>
                                    <Input placeholder="שם מלא" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>טלפון</FormLabel>
                                <FormControl>
                                    <Input placeholder="טלפון" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>אימייל</FormLabel>
                                <FormControl>
                                    <Input placeholder="אימייל" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Entry Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="entry_date_from"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>תאריך כניסה מ-</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="entry_date_to"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>תאריך כניסה עד-</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full">פרסם נכס</Button>
            </form>
        </Form>
    );
}