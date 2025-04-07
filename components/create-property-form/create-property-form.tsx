"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BadgeDollarSign, Home, Hotel, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import RentalForm from "./rental-form"
import SaleForm from "./sale-form"
import SubletForm from "./sublet-form"

type PropertyType = "rental" | "sublet" | "sale" | null

export default function CreatePropertyForm() {
    const [propertyType, setPropertyType] = useState<PropertyType>(null)

    const propertyTypes = [
        {
            value: "rental",
            label: "השכרה",
            description: "השכרה",
            icon: <Home />
        },
        {
            value: "sublet",
            label: "סאבלט",
            description: "השכרה לטווח קצר",
            icon: <Hotel />
        },
        {
            value: "sale",
            label: "מכירה",
            description: "מכירת הנכס",
            icon: <BadgeDollarSign />
        }
    ] as const

    return (
        <div className="w-full bg-background rounded-lg overflow-y-auto">
            {!propertyType ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">מה תרצה לעשות עם הנכס?</h2>
                    <RadioGroup
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        value={propertyType || ""}
                        onValueChange={(value) => setPropertyType(value as PropertyType)}
                    >
                        {propertyTypes.map((type) => (
                            <div key={type.value}>
                                <RadioGroupItem
                                    value={type.value}
                                    id={type.value}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={type.value}
                                    className={cn(
                                        "flex gap-2 h-24 flex-col items-center justify-center rounded-lg border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                                        propertyType === type.value && "border-primary bg-accent/50"
                                    )}
                                >
                                    <div>
                                        {type.icon}
                                    </div>
                                    <h3 className="font-semibold">{type.label}</h3>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">פרטי הנכס</h2>
                        <Button
                            variant="outline"
                            onClick={() => setPropertyType(null)}
                        >
                            חזור
                        </Button>
                    </div>

                    {propertyType === "rental" && <RentalForm />}
                    {propertyType === "sublet" && <SubletForm />}
                    {propertyType === "sale" && <SaleForm />}
                </div>
            )}
        </div>
    )
}
