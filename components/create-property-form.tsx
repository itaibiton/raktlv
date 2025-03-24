"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Slider } from "@/components/ui/slider"

const formSchema = z.object({
    title: z.string().min(2, { message: "נדרש כותרת של לפחות 2 תווים" }),
    description: z.string().min(10, { message: "נדרש תיאור של לפחות 10 תווים" }),
    propertyType: z.string({ required_error: "יש לבחור סוג נכס" }),
    price: z.number().min(1, { message: "יש להזין מחיר" }),
    bedrooms: z.number().min(0),
    bathrooms: z.number().min(0),
    location: z.object({
        placeName: z.string().optional(),
        coordinates: z.tuple([z.number(), z.number()]).optional(),
    }).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional(),
})

export default function CreatePropertyForm() {
    const [images, setImages] = useState<File[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            propertyType: "",
            price: 0,
            bedrooms: 0,
            bathrooms: 0,
            amenities: [],
            images: [],
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // Here you would add the function to call Supabase
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setImages(prev => [...prev, ...newFiles])
            form.setValue('images', [...images, ...newFiles])
        }
    }

    const amenitiesList = [
        { id: "airConditioner", label: "מיזוג אוויר" },
        { id: "parking", label: "חניה" },
        { id: "elevator", label: "מעלית" },
        { id: "balcony", label: "מרפסת" },
        { id: "securityRoom", label: "ממ״ד" },
        { id: "storage", label: "מחסן" },
        { id: "furnished", label: "מרוהט" },
        { id: "accessible", label: "נגיש" },
        { id: "pets", label: "מתאים לחיות מחמד" },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild className="w-fit flex items-center gap-2">
                <Button variant="outline">
                    <p className="hidden md:block">פרסם נכס</p>
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle>פרסום נכס חדש</DialogTitle>
                    <DialogDescription>
                        מלא את הפרטים כדי לפרסם נכס חדש
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>כותרת</FormLabel>
                                    <FormControl>
                                        <Input placeholder="כותרת לנכס" {...field} />
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
                                        <Textarea
                                            placeholder="תאר את הנכס בפירוט"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="propertyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>סוג נכס</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="בחר סוג נכס" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="apartment">דירה</SelectItem>
                                            <SelectItem value="house">בית פרטי</SelectItem>
                                            <SelectItem value="penthouse">פנטהאוז</SelectItem>
                                            <SelectItem value="studio">סטודיו</SelectItem>
                                            <SelectItem value="garden">דירת גן</SelectItem>
                                            <SelectItem value="duplex">דופלקס</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>מחיר (₪)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="הזן מחיר"
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="bedrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>חדרי שינה: {field.value}</FormLabel>
                                        <FormControl>
                                            <Slider
                                                defaultValue={[field.value]}
                                                min={0}
                                                max={10}
                                                step={1}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bathrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>חדרי רחצה: {field.value}</FormLabel>
                                        <FormControl>
                                            <Slider
                                                defaultValue={[field.value]}
                                                min={0}
                                                max={5}
                                                step={0.5}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>מיקום</FormLabel>
                                    <FormControl>
                                        <Input placeholder="הזן כתובת"
                                            onChange={(e) => field.onChange({
                                                ...field.value,
                                                placeName: e.target.value
                                            })}
                                            value={field.value?.placeName || ""}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        הזן כתובת מדויקת של הנכס
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <Label>תוספות ומאפיינים</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {amenitiesList.map((amenity) => (
                                    <FormField
                                        key={amenity.id}
                                        control={form.control}
                                        name="amenities"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-x-reverse">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(amenity.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValues = field.value || []
                                                            if (checked) {
                                                                field.onChange([...currentValues, amenity.id])
                                                            } else {
                                                                field.onChange(currentValues.filter(value => value !== amenity.id))
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="mr-2 font-normal cursor-pointer">
                                                    {amenity.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>תמונות</Label>
                            <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    גרור תמונות לכאן או לחץ להעלאה
                                </p>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageUpload}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                >
                                    בחר תמונות
                                </Button>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative h-24 rounded-md overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => {
                                                    const newImages = [...images]
                                                    newImages.splice(index, 1)
                                                    setImages(newImages)
                                                    form.setValue('images', newImages)
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline">ביטול</Button>
                            <Button type="submit">פרסם נכס</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}