
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

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  // const dictionary = await getDictionary(lang);
  const supabase = await createClient();
  const { data: properties } = await supabase.from("properties").select();

  console.log("p", properties);

  return (
    <div className=" h-full w-full flex gap-4 flex-col md:flex-row">
      {/* Left: FilterSidebar */}
      <div className="flex flex-col">
        {/* <FilterSidebar dictionary={dictionary} /> */}
        <FilterSidebar />
      </div>
      {/* Right: PropertyList */}
      <div className="w-full h-full overflow-y-auto flex gap-4">
        <PropertyList properties={properties ?? []} />
        <div className="w-3/4 h-full hidden 2xl:block">
          <Map />
        </div>
      </div>
    </div>
  );
}

const SearchBar = () => {
  return (
    <div className="flex gap-2 flex-col">
      <Label className="flex gap-2 items-center">
        <Wand2 className="w-4 h-4" />
        Try our AI Search assistant
      </Label>
      <div className="flex gap-2">
        <Input placeholder="I want a 3 bedroom house in..." />
        <Button className="w-40">Search</Button>
      </div>
    </div>
  );
};
