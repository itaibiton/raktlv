"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Square, X } from "lucide-react";
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Database } from "@/schema";

const PropertyCard = ({
  property,
  onClick,
}: {
  property: Database["public"]["Tables"]["properties"]["Row"];
  onClick?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group h-96 md:h-80 overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col "
          onClick={onClick}
        >
          {JSON.stringify(property)}
          {/* <div className="relative aspect-[3/4] overflow-hidden">
            <div
              className={`absolute inset-0 bg-gray-200 ${
                !imageLoaded ? "block" : "hidden"
              }`}
            />
            <img
              src={property.photos[0]}
              alt={property.title}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "block" : "hidden"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="flex gap-2 absolute left-2 top-2">
              <Badge className="text-primary-foreground">{property.type}</Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-secondary-foreground">
              {property.address}
            </h3>
            <p className="text-primary text-sm mb-2">{property.title}</p>
            <div className="flex justify-between w-full flex-col gap-4">
              <div className="flex items-center gap-4 text-secondary-foreground text-sm">
                <span className="flex gap-2 items-center">
                  {" "}
                  <Bed className="w-4 h-4" /> {property.rooms}{" "}
                </span>
                <span className="flex gap-2 items-center">
                  {" "}
                  <Bath className="w-4 h-4" /> {property.bathrooms}{" "}
                </span>
                <span className="flex gap-2 items-center">
                  {" "}
                  <Square className="w-4 h-4" />{" "}
                  {property.square_feet.toLocaleString()}{" "}
                </span>
              </div>
              <div className="self-end">
                <Badge variant="secondary" className="rounded text-sm w-fit">
                  ${property.price.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div> */}
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="fixed"></DialogTitle>
        {JSON.stringify(property)}
        {/* <div className="grid md:grid-cols-2 gap-4">
          <div className="relative aspect-square">
            <img
              src={property?.photos?.[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary">{property.type}</Badge>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {property.title}
            </h2>
            <p className="text-3xl font-bold text-primary mb-4">
              ${property.price?.toLocaleString()}
            </p>
            <p className="text-primary mb-6">{property.location}</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-primary text-sm">Bedrooms</p>
                <p className="text-primary font-semibold">{property.rooms}</p>
              </div>
              <div className="text-center">
                <p className="text-primary text-sm">Bathrooms</p>
                <p className="text-primary font-semibold">
                  {property.bathrooms}
                </p>
              </div>
              <div className="text-center">
                <p className="text-primary text-sm">Square Feet</p>
                <p className="text-primary font-semibold">
                  {property.square_feet.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-primary mb-6">{property.description}</p>
            <Button className="w-full" size="lg">
              Contact Agent
            </Button>
          </div> */}
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyCard;
