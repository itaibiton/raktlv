"use client";

import PropertyCard from "@/components/property-card";
import { useState } from "react";
import { Input } from "./ui/input";
import { Database } from "@/schema";
import { useDictionary } from "@/providers/providers.tsx";

const PropertyList = ({
  properties,
}: {
  properties: Database["public"]["Tables"]["properties"]["Row"][];
}) => {
  const [selectedProperty, setSelectedProperty] = useState<
    Database["public"]["Tables"]["properties"]["Row"] | null
  >(null);

  const dictionary = useDictionary();

  const handlePropertyClick = (property: Database["public"]["Tables"]["properties"]["Row"]) => {
    console.log("property-list--property", property);
    setSelectedProperty(property);
  };

  return (
    <div className="relative flex flex-col w-full h-full overflow-y-auto scrollbar-hide " id="property-list-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        {properties?.map((property, i) => (
          <PropertyCard
            key={`${i}-property-list-1`}
            property={property}
            onClick={() => handlePropertyClick(property)}
          />
        ))}
      </div>
      <div className="fixed bottom-2 w-full h-20 bg-gradient-to-t from-background to-transparent pointer-events-none "></div>
    </div>
  );
};

export default PropertyList;
