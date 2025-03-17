"use client";

// ES6
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useFilterStore } from '@/store/filter-store';

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

export default function MapComponent() {
  const mapRef = useRef(null);
  const pluginInitializedRef = useRef(false);
  const { filters } = useFilterStore();
  const [center, setCenter] = useState<[number, number]>([34.81223, 32.10333]);
  const [zoom, setZoom] = useState<[number]>([12]);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Only initialize the RTL text plugin once
    if (!pluginInitializedRef.current) {
      initializeRTLTextPlugin();
      pluginInitializedRef.current = true;
    }

    // Add a check to verify the plugin loaded correctly
    setTimeout(() => {
      // @ts-ignore
      console.log('RTL Plugin Status:', mapboxgl.getRTLTextPluginStatus());
    }, 2000);
  }, []);

  // Update map when location filter changes
  useEffect(() => {
    if (filters.location?.coordinates) {
      setCenter(filters.location.coordinates);
      setZoom([20]); // Zoom in when a location is selected

      // If we have a map reference, we can also add a marker or fly to the location
      if (mapRef.current) {
        const map = mapRef.current as mapboxgl.Map;
        map.flyTo({
          center: {
            lng: filters.location.coordinates[0],
            lat: filters.location.coordinates[1]
          },
          zoom: 20,
          essential: true
        });
      }
    }
  }, [filters.location]);




  const onMapLoad = (map: any) => {
    mapRef.current = map;

    // Log all layers to help debug
    const layers = map.getStyle().layers;
    console.log('Available layers:', layers.map((layer: any) => layer.id));

    // Set Hebrew for all text layers
    layers.forEach((layer: any) => {
      if (layer.type === 'symbol' &&
        map.getLayoutProperty(layer.id, 'text-field') !== undefined) {
        try {
          // Try to set Hebrew text for this layer
          console.log(`Setting Hebrew for layer: ${layer.id}`);

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
          console.log(`Error setting Hebrew for layer ${layer.id}:`, e);
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
          console.log(`Error setting RTL for layer ${layer.id}:`, e);
        }
      }
    });

    console.log('Map customization complete');
  };

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v11"
      containerStyle={{
        height: '100%',
        width: '100%',
      }}
      center={center}
      zoom={zoom}
      onStyleLoad={onMapLoad}
    >

    </Map>
  );
}
