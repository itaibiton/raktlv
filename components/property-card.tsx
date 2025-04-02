import { DialogTrigger } from "./ui/dialog"
import { Database } from "@/schema"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Heart, Eye, BedDouble, Square, Calendar, ArrowLeft, Building2 } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import Image from "next/image"
import { useState, useEffect, useTransition, useOptimistic } from "react"
import { Separator } from "./ui/separator"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import { createClient } from "@/utils/supabase/client";
// import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"

// Add a helper function to format dates in Hebrew style
const formatHebrewDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  // Format as DD/MM/YYYY which is common in Israel
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const PropertyCard = ({
  property,
  onClick,
}: {
  property: Database["public"]["Tables"]["properties"]["Row"] & { isLiked?: boolean },
  onClick?: () => void;
}) => {

  const dictionary = useDictionary();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [liked, setLiked] = useState(property.isLiked || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // const supabase = useSupabaseClient();

  const supabase = createClient();

  const router = useRouter();

  const { user } = useUser();


  const [isPending, startTransition] = useTransition();

  // Add optimistic state for liked status
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(
    liked,
    (currentState, newState: boolean) => newState
  );

  // Update local state if the prop changes (e.g., after a refresh)
  useEffect(() => {
    setLiked(property.isLiked || false);
  }, [property.isLiked]);

  // Update optimisticLiked when liked state changes
  useEffect(() => {
    startTransition(() => {
      setOptimisticLiked(liked);
    });
  }, [liked, setOptimisticLiked]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    startTransition(async () => {
      e.stopPropagation();
      console.log("Like button clicked, current state:", optimisticLiked);

      console.log("supabase.auth.getUser()", await supabase.auth.getUser());

      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        // alert(dictionary?.alerts?.login_required || "Please login to save properties");
        router.push("/sign-in");
        return;
      }

      // Optimistically update the UI
      setOptimisticLiked(!optimisticLiked);

      const userId = user.id;

      // Wrap the actual database operation in a transition
      try {
        // const supabase = createClient();
        console.log("Adding/removing like with data:", {
          property_id: property.property_id,
          user_id: userId,
          currentLiked: liked
        });

        if (liked) {
          // Try to find the record first
          const { data: findData, error: findError } = await supabase
            .from('property_likes')
            .select('*')
            .eq('property_id', property.property_id)
            .eq('user_id', userId!);

          console.log("Found records to delete:", findData, "Error:", findError);

          // Remove like
          const { data, error } = await supabase
            .from('property_likes')
            .delete()
            .eq('property_id', property.property_id)
            .eq('user_id', userId!);

          console.log("Delete result:", data, "Error:", error);

          if (!error) {
            setLiked(false);
          } else {
            console.error("Error removing like:", error);
            // Revert optimistic update on error
            setOptimisticLiked(true);
          }
        } else {
          // Add like - let's try with explicit casting if needed
          const { data, error } = await supabase
            .from('property_likes')
            .insert({
              property_id: property.property_id,
              user_id: userId!
            });

          console.log("Insert result:", data, "Error:", error);

          if (!error) {
            setLiked(true);
            toast.success(dictionary?.alerts?.property_liked);
          } else {
            console.error("Error adding like:", error);
            // Revert optimistic update on error
            setOptimisticLiked(false);
          }
        }
      } catch (err) {
        console.error("Exception in handleLike:", err);
        // Revert optimistic update on exception
        setOptimisticLiked(liked);
      }
    });
  }

  // Format price with currency
  // const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
  const formattedPrice = property.price ? formatPrice(property.price, property.type) : "Price on request";

  // // Get first photo for card thumbnail
  // const thumbnailImage = property.photos && property.photos.length > 0
  //   ? property.photos[0]
  //   : "/placeholder-property.jpg";

  return (
    <Card onClick={onClick} className="group h-full overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in flex flex-col">
      <CardContent className="w-full h-full flex flex-col pb-4 px-0 gap-4 relative">
        {
          user &&
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            <motion.div
              initial={{ width: "32px" }}
              whileHover={{ width: "auto" }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              onHoverStart={() => setBtnHover(true)}
              onHoverEnd={() => setBtnHover(false)}
            >
              <Button
                variant="secondary"
                className={`h-8 w-full flex items-center bg-white/50 backdrop-blur-sm ${isPending || isLikeLoading ? 'opacity-70' : ''}`}
                onClick={handleLike}
                disabled={isPending || isLikeLoading}
              >
                <span className="overflow-hidden whitespace-nowrap">
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={btnHover ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mx-2"
                  >
                    אהבתי
                  </motion.span>
                </span>
                <Heart className={`h-5 w-5 flex-shrink-0 ${isLikeLoading ? 'text-gray-300' : optimisticLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
              </Button>
            </motion.div>
          </div>
        }
        <div className="relative h-48 w-full overflow-hidden group-hover:scale-105 transition-all duration-300">
          <motion.div
            className="relative overflow-hidden rounded-lg"
            layoutId={`property-container-${property.property_id}`}
          >
            <motion.img
              layoutId={`property-image-${property.property_id}`}
              src={property.photos?.[0]}
              alt={property.title}
              className="object-cover w-full h-full"
              loading="eager"
            />
          </motion.div>
          {/* {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )} */}
        </div>
        <div className="px-4">
          <h3 className="font-bold">{property.place_name}</h3>
          {/* Todo: add location */}
          <p className="text-sm text-muted-foreground">דירה , תל אביב , הטיילת</p>
        </div>
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4 text-sm text-muted-foreground w-full">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.square_feet} {dictionary?.filterForm.square_feet}</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{dictionary?.filterForm.floor} {property.floor}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-end px-4">
          <span className="flex flex-col gap-1">
            <p className="text-sm">{dictionary?.filterForm[property.type as keyof typeof dictionary.filterForm]}</p>
            {property.type === 'sublet' &&
              <div className="flex gap-2  text-sm items-center">
                <Calendar className="w-4 h-4" />
                <span className="flex items-center gap-1">
                  {formatHebrewDate(property.entry_date_from!)}
                  <ArrowLeft className="w-4 h-4" /> {formatHebrewDate(property.entry_date_to!)}
                </span>
              </div>
            }
            {property.type === 'rental' &&
              <div className="flex gap-2  text-sm items-center">
                <Calendar className="w-4 h-4" />
                <span>{formatHebrewDate(property.entry_date_from!)}</span>
              </div>
            }
            {property.type === 'sale' &&
              <div className="flex gap-2  text-sm items-center">
                <Calendar className="w-4 h-4" />
                <span>{formatHebrewDate(property.entry_date_from!)}</span>
              </div>
            }
          </span>
          <p className="font-bold text-sm">{formattedPrice}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;

