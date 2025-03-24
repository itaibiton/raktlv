"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Square, X, MapPin, Calendar, Home, BedDouble, Heart, Eye, ArrowLeft } from "lucide-react";
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
import { Separator } from "./ui/separator";
import PropertyModalTrigger from "./property-modal-trigger";
import PropertyModalContent from "./property-modal-content";


const PropertyCard = ({
  property,
  onClick,
}: {
  property: Database["public"]["Tables"]["properties"]["Row"];
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
      <PropertyModalTrigger property={property} />
      <PropertyModalContent property={property} />
    </Dialog>
  );
};

export default PropertyCard;

