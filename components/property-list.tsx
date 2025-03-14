"use client";

import PropertyCard from "@/components/property-card";
import { useState } from "react";
import { Input } from "./ui/input";
import { Database } from "@/schema";

const PropertyList = ({
  properties,
}: {
  properties: Database["public"]["Tables"]["properties"]["Row"][];
}) => {
  const [selectedProperty, setSelectedProperty] = useState<
    Database["public"]["Tables"]["properties"]["Row"] | null
  >(null);

  return (
    <div className="flex flex-col w-full">
      {/* <div className="grid gap-4 overflow-y-auto w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 content-start"> */}
      <div className="grid gap-4 overflow-y-auto w-full grid-cols-1 lg:grid-cols-2 content-start px-4">
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
