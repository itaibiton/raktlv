"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export default function CreatePropertyForm() {
    return (
        <Dialog>
            <DialogTrigger asChild className="w-fit flex items-center gap-2">
                <Button variant="outline">
                    <p className="hidden md:block">פרסם נכס</p>
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Property</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new property.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Form fields will go here */}
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}