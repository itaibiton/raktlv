"use client";

// ES6
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useFilterStore } from '@/store/filter-store';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/store/filter-store";
import { Database } from '@/schema';

// // ES5
// var ReactMapboxGl = require('react-mapbox-gl');
// var Layer = ReactMapboxGl.Layer;
// var Feature = ReactMapboxGl.Feature;
// require('mapbox-gl/dist/mapbox-gl.css');

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Initialize the RTL plugin
const initializeRTLTextPlugin = () => {
  // @ts-ignore - the mapboxgl types don't include the RTL plugin
  if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
    // @ts-ignore
    mapboxgl.setRTLTextPlugin(
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      null!,
      true // Lazy load the plugin
    );
  }
};

const Map = ReactMapboxGl({
  accessToken: accessToken ?? '',
});

export default function MapComponent({ properties }: { properties: Database["public"]["Tables"]["properties"]["Row"][] }) {
  const mapRef = useRef(null);
  const pluginInitializedRef = useRef(false);
  const { filters } = useFilterStore();
  const [center, setCenter] = useState<[number, number]>([34.78057, 32.08088]); // Tel Aviv coordinates
  const [zoom, setZoom] = useState<[number]>([12]);
  const [markers, setMarkers] = useState<any[]>([]);

  // Define a more accurate Tel Aviv boundary using GeoJSON coordinates
  const telAvivCoordinates = [
    [34.7673, 32.0504], // Southern point
    [34.7547, 32.0594],
    [34.7534, 32.0701],
    [34.7465, 32.0815],
    [34.7534, 32.0935],
    [34.7631, 32.1023],
    [34.7768, 32.1097],
    [34.7905, 32.1156],
    [34.8042, 32.1156],
    [34.8179, 32.1097],
    [34.8261, 32.0991],
    [34.8261, 32.0885],
    [34.8179, 32.0779],
    [34.8097, 32.0673],
    [34.7960, 32.0567],
    [34.7810, 32.0504] // Back to close the polygon
  ];

  // Define max bounds that extend beyond Tel Aviv
  // Format is [[min longitude, min latitude], [max longitude, max latitude]]
  const extendedBounds = [
    [34.72, 32.02], // Southwest corner - extended beyond Tel Aviv
    [34.85, 32.14]  // Northeast corner - extended beyond Tel Aviv
  ];

  // Create a GeoJSON polygon for the mask (area outside Tel Aviv)
  const maskPolygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        // Outer ring (world bounds)
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90]
        ],
        // Inner ring (Tel Aviv shape - must be in clockwise order)
        telAvivCoordinates
      ]
    },
    properties: {}
  };

  useEffect(() => {
    // Only initialize the RTL text plugin once
    if (!pluginInitializedRef.current) {
      initializeRTLTextPlugin();
      pluginInitializedRef.current = true;
    }

    // Add a check to verify the plugin loaded correctly
    setTimeout(() => {
      // @ts-ignore
      // console.log('RTL Plugin Status:', mapboxgl.getRTLTextPluginStatus());
    }, 2000);
  }, []);

  // Update map when location filter changes
  useEffect(() => {
    if (filters.location?.coordinates) {
      // console.log('Location filter changed:', filters.location);
      setCenter(filters.location.coordinates);

      // If we have a map reference, we can also add a marker or fly to the location
      if (mapRef.current) {
        const map = mapRef.current as mapboxgl.Map;

        // Clear existing markers from the map
        markers.forEach(marker => marker.remove());

        // Check if the location is at the default center
        const isCenterLocation =
          filters.location.coordinates[0] === DEFAULT_CENTER[0] &&
          filters.location.coordinates[1] === DEFAULT_CENTER[1];

        if (!isCenterLocation) {
          // Add a new marker at the selected location
          const newMarker = new mapboxgl.Marker()
            .setLngLat(filters.location.coordinates)
            .addTo(map);

          setMarkers([newMarker]);

          // For non-default locations, use a higher zoom level
          const targetZoom = 18;

          // For consistent animation, first zoom out slightly
          map.easeTo({
            zoom: Math.max(map.getZoom() - 2, 10),
            duration: 300
          });

          // Then fly to the actual location with animation
          setTimeout(() => {
            map.flyTo({
              center: filters.location?.coordinates as [number, number],
              zoom: targetZoom,
              essential: true,
              duration: 2000,
              curve: 1.5 // Add some easing
            });
          }, 350);
        } else {
          // For default center location, zoom out to a wider view without animation
          const defaultZoomLevel = DEFAULT_ZOOM; // Use the default zoom from your constants
          setZoom([defaultZoomLevel]);

          // Use jumpTo instead of flyTo for immediate transition without animation
          map.easeTo({
            center: DEFAULT_CENTER,
            zoom: 10
          });
        }
      }
    }
  }, [filters.location]);

  const onMapLoad = (map: any) => {
    mapRef.current = map;

    // Add the mask source and layer
    map.addSource('outside-tel-aviv', {
      type: 'geojson',
      data: maskPolygon
    });

    map.addLayer({
      id: 'outside-tel-aviv-mask',
      type: 'fill',
      source: 'outside-tel-aviv',
      paint: {
        'fill-color': '#cccccc',
        'fill-opacity': 0.7
      }
    }, 'road-label'); // Insert before labels so text remains visible

    // Add a border around Tel Aviv
    map.addLayer({
      id: 'tel-aviv-border',
      type: 'line',
      source: 'outside-tel-aviv',
      paint: {
        'line-color': '#0078ff',
        'line-width': 2
      },
      filter: ['==', '$type', 'Polygon']
    });

    // Log all layers to help debug
    const layers = map.getStyle().layers;
    // console.log('Available layers:', layers.map((layer: any) => layer.id));

    // Set Hebrew for all text layers
    layers.forEach((layer: any) => {
      if (layer.type === 'symbol' &&
        map.getLayoutProperty(layer.id, 'text-field') !== undefined) {
        try {
          // Try to set Hebrew text for this layer
          // console.log(`Setting Hebrew for layer: ${layer.id}`);

          // First try with name_he
          if (map.getLayoutProperty(layer.id, 'text-field')) {
            map.setLayoutProperty(layer.id, 'text-field', ['coalesce',
              ['get', 'name_he'],
              ['get', 'name:he'],
              ['get', 'name_hebrew'],
              ['get', 'name:hebrew'],
              ['get', 'name']
            ]);
          }
        } catch (e) {
          // console.log(`Error setting Hebrew for layer ${layer.id}:`, e);
        }
      }
    });

    // Force RTL text direction for all symbol layers
    layers.forEach((layer: any) => {
      if (layer.type === 'symbol') {
        try {
          // map.setLayoutProperty(layer.id, 'text-writing-mode', ['hebrew']);
          map.setLayoutProperty(layer.id, 'text-letter-spacing', 0.1);
        } catch (e) {
          // console.log(`Error setting RTL for layer ${layer.id}:`, e);
        }
      }
    });

    // console.log('Map customization complete');
  };

  return (
    <Map
      // style="mapbox://styles/mapbox/streets-v11"
      style="mapbox://styles/mapbox/outdoors-v11"
      containerStyle={{
        height: '100%',
        width: '100%',
      }}
      // center={center}
      // zoom={zoom}
      onStyleLoad={onMapLoad}
      maxBounds={extendedBounds as any}
    >
    </Map>
  );
}
