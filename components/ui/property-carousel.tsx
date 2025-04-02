"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PropertyCarouselProps {
    photos: string[];
    propertyId?: number;
    isFirstImageAnimated?: boolean;
    className?: string;
}

export function PropertyCarousel({
    photos,
    propertyId,
    isFirstImageAnimated = false,
    className
}: PropertyCarouselProps) {
    if (!photos || photos.length === 0) return null;

    return (
        <div className={cn("relative", className)}>
            <Carousel
                opts={{
                    loop: true,
                    direction: "rtl"
                }}
                className="w-full"
            >
                <CarouselContent className="w-full p-0">
                    {photos.map((photo, index) => (
                        <CarouselItem key={index} className="w-full p-0">
                            <div className="relative  h-96">
                                {isFirstImageAnimated && index === 0 ? (
                                    <motion.div
                                        className="relative w-full h-full"
                                        layoutId={`property-container-${propertyId}`}
                                    >
                                        <motion.img
                                            layoutId={`property-image-${propertyId}`}
                                            src={photo}
                                            alt={`Property image ${index + 1}`}
                                            className="object-cover w-full h-full"
                                            loading="eager"
                                        />
                                    </motion.div>
                                ) : (
                                    <Image
                                        src={photo}
                                        alt={`Property image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {photos.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 p-0" />
                        <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 p-0" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {photos.length} תמונות
                        </div>
                    </>
                )}
            </Carousel>
        </div>
    );
} 