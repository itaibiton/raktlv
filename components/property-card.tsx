'use client';


import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';

const PropertyCard = ({ property, onClick }: { property: any, onClick: () => void }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return <Dialog>
        <DialogTrigger asChild>
            <Card
                className="group h-64 overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col"
                onClick={onClick}
            >
                <div className="relative aspect-[3/4] overflow-hidden">
                    <div
                        className={`absolute inset-0 bg-gray-200 ${!imageLoaded ? "block" : "hidden"
                            }`}
                    />
                    <img
                        src={property.photos[0]}
                        alt={property.title}
                        className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? "block" : "hidden"
                            }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    <Badge className="absolute left-2 top-2 bg-white/90 text-real-800">
                        {property.type}
                    </Badge>
                    <Badge
                        className="absolute right-2 top-2 bg-primary/90 text-primary-foreground"
                        variant="default"
                    >
                        {property.status}
                    </Badge>
                </div>
                <div className="p-2">
                    <h3 className="text-lg font-semibold text-real-800">
                        {property.address}
                    </h3>
                    <p className="text-real-500 text-sm mb-2">
                        {property.title}
                    </p>
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-4 text-real-600 text-sm">
                            <span>{property.rooms} beds</span>
                            <span>{property.bathrooms} baths</span>
                            <span>{property.area.toLocaleString()} sqft</span>
                        </div>
                        <p className=" font-bold text-primary">
                            ${property.price.toLocaleString()}
                        </p>
                    </div>
                </div>
            </Card>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <DialogTitle className='fixed'></DialogTitle>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="relative aspect-square">
                    <img
                        src={property?.photos[0]}
                        alt={property.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="secondary">{property.type}</Badge>
                        {/* <Badge variant="default">{property.status}</Badge> */}
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-real-800 mb-2">
                        {property.title}
                    </h2>
                    <p className="text-3xl font-bold text-primary mb-4">
                        ${property.price.toLocaleString()}
                    </p>
                    <p className="text-real-600 mb-6">{property.location}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <p className="text-real-500 text-sm">Bedrooms</p>
                            <p className="text-real-800 font-semibold">{property.rooms}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-real-500 text-sm">Bathrooms</p>
                            <p className="text-real-800 font-semibold">
                                {property.bathrooms}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-real-500 text-sm">Square Feet</p>
                            <p className="text-real-800 font-semibold">
                                {property.area.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <p className="text-real-600 mb-6">{property.description}</p>
                    <Button className="w-full" size="lg">
                        Contact Agent
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

export default PropertyCard