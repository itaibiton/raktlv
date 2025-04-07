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
import { BadgeDollarSign, Home, Hotel, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AnimateHeight } from "@/components/ui/animate-height"
import RentalForm from "./create-property-form/rental-form"
import SaleForm from "./create-property-form/sale-form"
import SubletForm from "./create-property-form/sublet-form"
import Link from "next/link"
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

export default function CreatePropertyButton() {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)
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

    const handleNext = () => {
        setDirection(1)
        setStep(2)
    }

    const handleBack = () => {
        setDirection(-1)
        setStep(1)
    }

    return (
        <Link href="/upload">
            <Button variant="outline" className="gap-2 flex items-center">
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">פרסם נכס</span>
            </Button>
        </Link>

    )
}


