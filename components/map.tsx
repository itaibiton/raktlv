"use client";

// ES6
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// // ES5
// var ReactMapboxGl = require('react-mapbox-gl');
// var Layer = ReactMapboxGl.Layer;
// var Feature = ReactMapboxGl.Feature;
// require('mapbox-gl/dist/mapbox-gl.css');

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Initialize the RTL plugin
const initializeRTLTextPlugin = () => {
  // @ts-ignore - the mapboxgl types don't include the RTL plugin
  if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
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

  useEffect(() => {
    // Initialize the RTL text plugin when component mounts
    initializeRTLTextPlugin();

    // Add a check to verify the plugin loaded correctly
    setTimeout(() => {
      // @ts-ignore
      console.log('RTL Plugin Status:', mapboxgl.getRTLTextPluginStatus());
    }, 2000);
  }, []);

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
        minWidth: '600px'
      }}
      center={[34.81223, 32.10333]}
      zoom={[12]}

      onStyleLoad={onMapLoad}
    >
    </Map>
  );
}
