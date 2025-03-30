"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AnimateHeight } from "@/components/ui/animate-height"

type PropertyType = "rental" | "sublet" | "sale" | null

const slideAnimation = {
    initial: (direction: number) => ({
        // x: direction > 0 ? 100 : -100,
        x: 0,
        opacity: 0,
        height: 0
    }),
    animate: {
        x: 0,
        opacity: 1,
        height: "auto"
    },
    exit: (direction: number) => ({
        // x: direction > 0 ? -100 : 100,
        x: 0,
        opacity: 0,
        height: 0
    })
}

const contentVariants = {
    step1: {
        height: "280px", // Adjust these values based on your content
    },
    step2: {
        height: "400px", // Adjust these values based on your content
    }
}

export default function CreateExperienceForm() {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)
    const [propertyType, setPropertyType] = useState<PropertyType>(null)

    const propertyTypes = [
        {
            value: "rental",
            label: "השכרה",
            description: "השכרה לטווח ארוך"
        },
        {
            value: "sublet",
            label: "סאבלט",
            description: "השכרת משנה לטווח קצר"
        },
        {
            value: "sale",
            label: "מכירה",
            description: "מכירת הנכס"
        }
    ] as const

    const handleNext = () => {
        setDirection(1)
        setStep(2)
    }

    const handleBack = () => {
        setDirection(-1)
        setStep(1)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:block">פרסם נכס</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden" dir="rtl">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "מה תרצה לעשות עם הנכס?" : "פרטי הנכס"}
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideAnimation}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                    height: {
                                        duration: 0.4,
                                        ease: [0.33, 1, 0.68, 1]
                                    }
                                }}
                                className="w-full"
                            >
                                <RadioGroup
                                    className="grid grid-cols-3 gap-4"
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
                                                    "flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                                                    propertyType === type.value && "border-primary bg-accent/50"
                                                )}
                                            >
                                                <h3 className="font-semibold">{type.label}</h3>
                                                <p className="text-sm text-muted-foreground text-center mt-2">
                                                    {type.description}
                                                </p>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                <div className="flex justify-end mt-6">
                                    <Button
                                        onClick={handleNext}
                                        disabled={!propertyType}
                                    >
                                        המשך
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideAnimation}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                    height: {
                                        duration: 0.4,
                                        ease: [0.33, 1, 0.68, 1]
                                    }
                                }}
                                className="w-full"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">כותרת</Label>
                                        <Input
                                            id="title"
                                            placeholder="תן כותרת לנכס שלך"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">מחיר</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="הכנס מחיר"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                    >
                                        חזור
                                    </Button>
                                    <Button type="submit">
                                        שמור
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}


