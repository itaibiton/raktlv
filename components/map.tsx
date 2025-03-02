"use client";

// import React, { useState, ChangeEvent, useRef, useEffect } from "react";
// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// // shadcn/ui components
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// // Initialize map outside component to prevent re-initialization
// const Map = ReactMapboxGl({
//   accessToken: MAPBOX_TOKEN,
// });

// const MapWithShadcnSearch = () => {
//   // Check if token exists early
//   const [tokenError, setTokenError] = useState(!MAPBOX_TOKEN);

//   // State for search and suggestions
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [open, setOpen] = useState(false);

//   // Map state - only update this when a location is selected
//   const [mapState, setMapState] = useState({
//     center: [34.78, 32.08] as [number, number],
//     zoom: [12] as [number],
//     selectedFeature: null as any,
//     markerCoord: [34.78, 32.08] as [number, number],
//   });

//   // Debug state to show bbox information
//   const [debugInfo, setDebugInfo] = useState("");

//   // Add a ref for the input element
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Debounced search to reduce API calls
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchText);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchText]);

//   // Fetch suggestions when debounced search changes
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       // If empty search or no token, clear suggestions
//       if (!debouncedSearch || !MAPBOX_TOKEN) {
//         setSuggestions([]);
//         setOpen(false);
//         return;
//       }

//       try {
//         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           debouncedSearch
//         )}.json?access_token=${MAPBOX_TOKEN}&limit=5`;
//         const res = await fetch(url);
//         const data = await res.json();

//         if (data.features && data.features.length > 0) {
//           setSuggestions(data.features);
//           setOpen(true);
//         } else {
//           setSuggestions([]);
//           setOpen(debouncedSearch.length > 0); // Keep open with "no results" if there's text
//         }
//       } catch (error) {
//         console.error("Mapbox geocoding error:", error);
//         setSuggestions([]);
//         setOpen(false);
//       }
//     };

//     fetchSuggestions();
//   }, [debouncedSearch, MAPBOX_TOKEN]);

//   // Handle input changes - just update text, don't fetch yet
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value);
//   };

//   // When suggestion selected
//   const handleSelectSuggestion = (feature: any) => {
//     // Check if feature.center exists and is an array before destructuring
//     if (!feature.center || !Array.isArray(feature.center)) {
//       console.error("Invalid feature center:", feature);
//       return;
//     }

//     const [lng, lat] = feature.center; // [longitude, latitude]

//     // Set appropriate zoom level based on feature type
//     const zoomLevels: { [key: string]: number } = {
//       country: 5,
//       region: 7,
//       postcode: 10,
//       district: 11,
//       place: 12,
//       locality: 13,
//       neighborhood: 14,
//       address: 16,
//       poi: 17,
//     };

//     // Get the highest precision place type
//     const placeType =
//       feature.place_type && feature.place_type.length > 0
//         ? feature.place_type[0]
//         : "address";

//     // Debug bbox information
//     const hasBbox = feature.bbox ? "Yes" : "No";
//     setDebugInfo(
//       `Has bbox: ${hasBbox}, Type: ${placeType}, Feature ID: ${feature.id}`
//     );
//     console.log("Selected feature:", feature);

//     // Update all map-related state at once to prevent re-renders
//     setMapState({
//       center: [lng, lat],
//       zoom: [zoomLevels[placeType] || 14],
//       selectedFeature: feature,
//       markerCoord: [lng, lat],
//     });

//     // Update search UI
//     setSearchText(feature.place_name);
//     setSuggestions([]);
//     setOpen(false);

//     // Refocus the input after selection
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   // Handle clicking outside
//   const handleOpenChange = (newOpen: boolean) => {
//     setOpen(newOpen);
//     // If the popover is closing and we have an input ref, refocus it
//     if (!newOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   // Prepare the bounding box coordinates for rendering
//   const getBboxPolygon = () => {
//     const { selectedFeature } = mapState;
//     if (!selectedFeature || !selectedFeature.bbox) return null;

//     // Create a polygon from the bbox
//     const [west, south, east, north] = selectedFeature.bbox;
//     return [
//       [west, south],
//       [east, south],
//       [east, north],
//       [west, north],
//       [west, south],
//     ];
//   };

//   return (
//     <div className="flex flex-col items-center p-4 space-y-4">
//       {tokenError && (
//         <div className="text-red-500 mb-2">
//           Error: Mapbox token is missing. Please check your environment
//           variables.
//         </div>
//       )}

//       {/* Separate Input from Popover structure */}
//       <div className="w-full max-w-md relative">
//         <Input
//           ref={inputRef}
//           placeholder="Search a location..."
//           value={searchText}
//           onChange={handleInputChange}
//           className="w-full"
//         />

//         <Popover open={open} onOpenChange={handleOpenChange}>
//           <PopoverTrigger className="absolute inset-0 w-full h-full opacity-0">
//             <span />
//           </PopoverTrigger>
//           <PopoverContent
//             className="w-[calc(100%-24px)] p-0 mt-1"
//             align="start"
//           >
//             <div className="py-2">
//               {suggestions.length === 0 ? (
//                 <p className="px-4 py-2 text-sm text-gray-500">
//                   No results found.
//                 </p>
//               ) : (
//                 <div>
//                   {suggestions.map((feature) => (
//                     <div
//                       key={feature.id}
//                       className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
//                       onClick={() => handleSelectSuggestion(feature)}
//                     >
//                       {feature.place_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Debug information */}
//       {debugInfo && (
//         <div className="text-xs text-gray-500 w-full max-w-md">{debugInfo}</div>
//       )}

//       {/* Map container */}
//       <div className="w-[800px] h-[500px] rounded-md overflow-hidden">
//         <Map
//           style="mapbox://styles/mapbox/streets-v9"
//           center={mapState.center}
//           zoom={mapState.zoom}
//           containerStyle={{
//             height: "100%",
//             width: "100%",
//           }}
//         >
//           {/* BBox highlighting - only if we have a bbox */}
//           {mapState.selectedFeature && mapState.selectedFeature.bbox && (
//             <>
//               <Layer
//                 type="fill"
//                 id="bbox-fill"
//                 paint={{
//                   "fill-color": "#FF0000",
//                   "fill-opacity": 0.2,
//                 }}
//               >
//                 <Feature coordinates={[getBboxPolygon()]} />
//               </Layer>
//               <Layer
//                 type="line"
//                 id="bbox-line"
//                 paint={{
//                   "line-color": "#FF0000",
//                   "line-width": 2,
//                 }}
//               >
//                 <Feature coordinates={getBboxPolygon()} />
//               </Layer>
//             </>
//           )}

//           {/* Custom marker with label - make sure this appears prominently */}
//           <Marker coordinates={mapState.markerCoord} anchor="bottom">
//             <div
//               className="flex flex-col items-center pointer-events-none"
//               style={{ transform: "translateY(-20px)" }}
//             >
//               <div className="relative">
//                 {/* Label with background */}
//                 <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold shadow-md whitespace-nowrap">
//                   It's here
//                 </div>
//                 {/* Arrow pointing down */}
//                 <div
//                   className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-blue-600 mx-auto"
//                   style={{ marginTop: "-1px" }}
//                 ></div>
//               </div>

//               {/* Pin icon */}
//               <div className="mt-1 text-red-600" style={{ fontSize: "24px" }}>
//                 📍
//               </div>
//             </div>
//           </Marker>
//         </Map>
//       </div>
//     </div>
//   );
// };

// export default MapWithShadcnSearch;

import React, { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let mapboxgl: any;

    // Only run this in the browser environment
    if (typeof window !== "undefined") {
      // Try/catch to handle potential errors during module loading
      try {
        // Need to require here as the module uses the window object
        mapboxgl = require("mapbox-gl");

        // Configure the access token
        if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
          throw new Error("Mapbox token is missing");
        }

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        // Check if the ref is available
        if (!mapContainerRef.current) return;

        // Initialize the map
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11", // Try a different style
          center: [34.78, 32.08],
          zoom: 12,
          attributionControl: false,
        });

        // Save the map instance
        mapInstanceRef.current = map;

        // Handle successful map load
        map.on("load", () => {
          setMapLoaded(true);
          console.log("Map loaded successfully");
        });

        // Handle map errors
        map.on("error", (e: any) => {
          console.error("Mapbox error:", e);
          setMapError(`Map error: ${e.error?.message || "Unknown error"}`);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError(
          `Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      className="w-full border relative rounded-xl"
      style={{ height: "500px" }}
    >
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0.75rem",
        }}
      />

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="mb-2">Loading map...</div>
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl">
          <div className="text-red-500 p-4 text-center">
            <p className="font-bold mb-2">Error loading map</p>
            <p>{mapError}</p>
            <p className="mt-2 text-sm">Check console for more details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
