import { Database } from "@/schema"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import { useFilterStore } from "@/store/filter-store";
import { PropertyCarousel } from "@/components/ui/property-carousel";
import PropertyContent from "./selected-property-content"



const SelectedProperty = ({ property }: { property: Database["public"]["Tables"]["properties"]["Row"] }) => {
    const { updateFilter } = useFilterStore()
    const dictionary = useDictionary()

    const photos = property.photos || [];

    return (
        <div className="flex flex-col w-full relative justify-start">
            <div className="overflow-y-auto scrollbar-hide relative">
                <div className="p-0 rounded-t-lg overflow-hidden sticky top-0 z-20 shadow-lg">
                    <PropertyCarousel photos={photos} propertyId={property.property_id} isFirstImageAnimated={true} />
                </div>
                <PropertyContent property={property} dictionary={dictionary} />
            </div>
            <Button
                className="flex gap-2 p-0 max-w-fit mt-4"
                variant="link"
                onClick={() => updateFilter("selectedProperty", null)}
            >
                <ArrowRight className="w-4 h-4" />
                {dictionary?.filterForm.back ?? "חזור"}
            </Button>
        </div>
    );
};

export default SelectedProperty