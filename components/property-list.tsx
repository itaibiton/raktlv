"use client";

import PropertyCard from "@/components/property-card";
import { useState } from "react";
import { Input } from "./ui/input";
import { Database } from "@/schema";
import { Dictionary } from "@/get-dictionary";

const PropertyList = ({
  properties,
  dictionary,
}: {
  properties: Database["public"]["Tables"]["properties"]["Row"][];
  dictionary: Dictionary;
}) => {
  const [selectedProperty, setSelectedProperty] = useState<
    Database["public"]["Tables"]["properties"]["Row"] | null
  >(null);

  return (
    <div className="flex flex-col w-full h-full  overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties?.map((property, i) => (
          <PropertyCard
            key={`${i}-property-list-1`}
            property={property}
            onClick={() => setSelectedProperty(property)}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
