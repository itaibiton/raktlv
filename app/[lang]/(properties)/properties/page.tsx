'use server';


import FilterSidebar from "@/components/filter-form/filter-sidebar";
import Map from "@/components/map";
import PropertyList from "@/components/property-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Locale } from "@/i18n-config";
import { createClient } from "@/utils/supabase/server";
import { Wand2 } from "lucide-react";
import { getDictionary } from "@/get-dictionary";
import { cookies } from "next/headers";
import { PropertiesContent } from "@/components/properties-content";

import { Database } from "@/schema";
// export default async function Page({
//   params,
//   searchParams
// }: {
//   params: { lang: Locale };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
export default async function Page(props: { params: Promise<{ lang: Locale }>, searchParams: Promise<{ propertyType: string }> }) {
  const { lang } = await props.params;
  const { propertyType } = await props.searchParams;
  // const dictionary = await getDictionary(lang);
  const supabase = await createClient();

  // Get the propertyType from the searchParams directly
  const propertyTypes = (await props?.searchParams)?.propertyType as string;

  console.log("propertyType", propertyTypes);

  // Fetch properties with optional filter
  let query = supabase.from("properties").select();

  // Apply propertyType filter if it exists
  if (propertyTypes) {
    console.log("propertyType", propertyTypes);

    // Split the property types by comma and filter out empty strings
    const propertyTypesArray = propertyTypes.split(',').filter(type => type.trim() !== '');

    if (propertyTypesArray.length > 0) {
      // Use .in() for multiple property types
      query = query.in('type', propertyTypesArray as Database["public"]["Enums"]["property_type"][]);
    }
  }

  const { data: properties } = await query;

  console.log("properties", properties);

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();

  // If user is logged in, fetch their liked properties
  let likedPropertyIds: string[] = [];
  if (session?.user) {
    const { data: likedProperties } = await supabase
      .from('property_likes')
      .select('property_id')
      .eq('user_id', session.user.id);

    likedPropertyIds = likedProperties?.map(like => like?.property_id?.toString() || '') || [];
  }

  // Enhance properties with liked status
  const enhancedProperties = properties?.map(property => ({
    ...property,
    isLiked: likedPropertyIds.includes(property.property_id.toString())
  })) || [];

  return <PropertiesContent properties={enhancedProperties} />
}

