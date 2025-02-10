'use client';

import PropertyCard from '@/components/property-card'
import { useState } from 'react';


const PropertyList = ({ properties }: { properties: any[] }) => {

    const [selectedProperty, setSelectedProperty] = useState<any[] | null>(
        null
    );

    return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto w-9/12">
        {properties?.map((property, _) => <PropertyCard key={`${_}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />)}
        {properties?.map((property, _) => <PropertyCard key={`${_}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />)}
        {properties?.map((property, _) => <PropertyCard key={`${_}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />)}
        {properties?.map((property, _) => <PropertyCard key={`${_}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />)}
        {properties?.map((property, _) => <PropertyCard key={`${_}-property-list-1`} property={property} onClick={() => setSelectedProperty(property)} />)}
    </div>

}


export default PropertyList