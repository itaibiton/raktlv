'use client';

import PropertyCard from '@/components/property-card'
import { useState } from 'react';


const PropertyList = ({ properties }: { properties: any[] }) => {

    const [selectedProperty, setSelectedProperty] = useState<any[] | null>(
        null
    );

    return (
        <>
            <div className="grid gap-4 overflow-y-auto w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 content-start">
                {properties?.map((property, i) => (
                    <PropertyCard key={`${i}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />
                ))}
                {properties?.map((property, i) => (
                    <PropertyCard key={`${i}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />
                ))}
                {properties?.map((property, i) => (
                    <PropertyCard key={`${i}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />
                ))}


            </div>

        </>
    );

}


export default PropertyList