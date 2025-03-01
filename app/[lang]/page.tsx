import FilterSidebar from '@/components/filter-sidebar'
import PropertyList from '@/components/property-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Building, Building2, Home, Search, Star, Wand2, Warehouse } from 'lucide-react'
import Map from '@/components/map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyCard from '@/components/property-card'
import RakTLVLogo from '@/components/rak-tlv'
import Image from 'next/image'
import { Locale } from "../../i18n-config";
import { getDictionary } from "@/get-dictionary";


export default async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  return <div className="min-h-screen bg-background flex flex-col w-full gap-4 items-center">
    {/* Hero Section */}
    <div className="relative h-[54vh] w-full">
      <div className="absolute inset-0">
        <Image
          // src="/assets/telaviv.jpg"
          src="https://cdn.britannica.com/80/94380-050-F182700B/Tel-Aviv-Yafo-Israel.jpg"
          alt="Tel Aviv Skyline"
          fill
          className="w-full h-full object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Logo placeholder */}
      <div className="absolute top-4 left-4 z-10">
        {/* <Image src="/assets/logos/Emblem/1x/white.png" alt="RakTLV Logo" width={60} height={60} /> */}
        <RakTLVLogo />
        {dictionary["server-component"].welcome}
        {/* <RakTLVIcon /> */}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 drop-shadow-md">
          Find Your Dream Home in Tel Aviv
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
          Discover premium properties in Israel's most vibrant city
        </p>
        <Link href="/properties">
          <Button size="lg" className="hover:bg-primary/90">
            <Search className="mr-2 h-5 w-5" /> Explore Properties
          </Button>
        </Link>
      </div>
    </div>

    {/* Property Types Tabs */}
    <div className="max-w-7xl w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <Star className="mr-2 h-4 w-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="apartments">
            <Home className="mr-2 h-4 w-4" />
            Apartments
          </TabsTrigger>
          <TabsTrigger value="houses">
            <Building className="mr-2 h-4 w-4" />
            Houses
          </TabsTrigger>
          <TabsTrigger value="penthouses">
            <Building2 className="mr-2 h-4 w-4" />
            Sublets
          </TabsTrigger>
        </TabsList>

        {/* Property Cards */}
        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property, index) => (
              <PropertyCard key={index} property={property} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="apartments">
          <div className="text-center py-8 text-muted-foreground">
            Content for apartments will be loaded here
          </div>
        </TabsContent>
        <TabsContent value="houses">
          <div className="text-center py-8 text-muted-foreground">
            Content for houses will be loaded here
          </div>
        </TabsContent>
        <TabsContent value="penthouses">
          <div className="text-center py-8 text-muted-foreground">
            Content for penthouses will be loaded here
          </div>
        </TabsContent>
        <TabsContent value="commercial">
          <div className="text-center py-8 text-muted-foreground">
            Content for commercial properties will be loaded here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
}


