
import FilterSidebar from '@/components/filter-form/filter-sidebar'
import PropertyList from '@/components/property-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Building, Building2, Hammer, Home, Search, Star, Wand2, Warehouse } from 'lucide-react'
import Map from '@/components/map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyCard from '@/components/property-card'
import RakTLVLogo from '@/components/rak-tlv'
import Image from 'next/image'
import { Locale } from "../../i18n-config";
import { getDictionary } from "@/get-dictionary";
import { motion } from "framer-motion";
import HomePageHammer from '@/components/home-page-hammer'


export default async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select()

  return <div className="min-h-screen bg-background flex flex-col w-full items-center justify-center">
    <div className="flex flex-col gap-10 items-center justify-center">
      <div className="flex gap-4 items-center justify-center">
        <HomePageHammer />
        <RakTLVLogo />
      </div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-2xl font-semibold">
          This page is under construction
        </p>
        <Link href="/properties" className="text-sm underline text-primary">
          To explore properties, click here
        </Link>
      </div>
    </div>
  </div>
}


