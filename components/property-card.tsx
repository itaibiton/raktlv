"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Square, X, MapPin, Calendar, Home, BedDouble } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Database } from "@/schema";
import { formatCurrency, formatPrice } from "@/lib/utils";
import { Dictionary } from "@/get-dictionary";

const PropertyCard = ({
  property,
  dictionary,
  onClick,
}: {
  property: Database["public"]["Tables"]["properties"]["Row"];
  dictionary: Dictionary;
  onClick?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format price with currency
  // const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
  const formattedPrice = property.price ? formatPrice(property.price, property.type) : "Price on request";

  // Get first photo for card thumbnail
  const thumbnailImage = property.photos && property.photos.length > 0
    ? property.photos[0]
    : "/placeholder-property.jpg";

  return (
    <Dialog>
      <DialogTrigger asChild
        onClick={onClick}
      >
        <Card className="group h-full overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col">
          <CardContent className="w-full h-full flex flex-col pb-4 px-0 gap-4">
            <div className="relative min-h-48 w-full overflow-hidden">
              <Image
                src={thumbnailImage}
                alt={property.title || "Property image"}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
            <div className="px-4">
              <h3 className="font-bold">{property.place_name}</h3>
              <p className="text-sm text-muted-foreground">{property.description}</p>
            </div>
            <div className="flex justify-between items-center px-4">
              <div className="flex gap-4 text-sm text-muted-foreground w-full">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{property.square_feet} {dictionary.filterForm.square_feet}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{dictionary.filterForm.floor} {property.floor}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 font-bold">
              <p className="text-sm">{dictionary.filterForm[property.type as keyof typeof dictionary.filterForm]}</p>
              <p className="text-sm">{formattedPrice}</p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
          <DialogDescription className="flex items-center">

          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="p-6 pt-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyCard;


const PropertyAmenities = ({ property }: { property: Database["public"]["Tables"]["properties"]["Row"] }) => {
  const amenities = [
    property.air_conditioner ? "מזכוכית" : null,
    property.balcony ? "בלקוני" : null,
    property.parking ? "חנייה" : null,
    property.pet_friendly ? "חיות מחמד" : null,
    property.elevator ? "מעלית" : null,
    property.disabled_access ? "גישה מוגזמת" : null,
    property.parking ? "חנייה" : null,
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.filter(Boolean).map((amenity, index) => (
        <Badge key={index} variant="outline" className="text-sm">{amenity}</Badge>
      ))}
    </div>
  );
};