"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Square, X, MapPin, Calendar, Home } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";

const PropertyCard = ({
  property,
  onClick,
}: {
  property: Database["public"]["Tables"]["properties"]["Row"];
  onClick?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format price with currency
  const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";

  // Get first photo for card thumbnail
  const thumbnailImage = property.photos && property.photos.length > 0
    ? property.photos[0]
    : "/placeholder-property.jpg";

  return (
    <Dialog>
      <DialogTrigger asChild
        onClick={onClick}
      >
        <Card className="group overflow-hidden h-72 rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col">
          <CardContent className="w-full h-full flex flex-col p-0">
            <div className="relative h-40 w-full overflow-hidden">
              <Image src={thumbnailImage} alt={property.title} fill className="object-cover transition-all duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{property.place_name}</h3>
              <p className="text-sm">{property.description}</p>
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
