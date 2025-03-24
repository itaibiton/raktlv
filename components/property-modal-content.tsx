"use client";

import { BedDouble } from "lucide-react";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Database } from "@/schema";
import { useDictionary } from "./providers/providers.tsx";
import ContactForm from "./contact-form";
import { Square } from "lucide-react";
import { Dictionary } from "@/get-dictionary";

export default function PropertyModalContent({ property }: { property: Database["public"]["Tables"]["properties"]["Row"] }) {
    const dictionary
        = useDictionary();
    return (
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <DialogHeader className="p-4">
                <DialogTitle className="text-2xl font-bold">
                    {property.place_name}
                </DialogTitle>
                <DialogDescription className="flex flex-col">
                    <span className="text-muted-foreground">דירה , תל אביב , הטיילת</span>
                    {property.description && (
                        <span className="text-muted-foreground">{property.description}</span>
                    )}
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                            <span>{dictionary?.filterForm.bedrooms}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.square_feet} {dictionary?.filterForm.square_feet}</span>
                        </span>
                    </span>
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="p-6 pt-0">
                <ContactForm property={property} />
            </DialogFooter>
        </DialogContent>
    );
}