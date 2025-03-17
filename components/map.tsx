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
      setZoom([14]); // Zoom in when a location is selected

      // If we have a map reference, we can also add a marker or fly to the location
      if (mapRef.current) {
        const map = mapRef.current as mapboxgl.Map;
        map.flyTo({
          center: {
            lng: filters.location.coordinates[0],
            lat: filters.location.coordinates[1]
          },
          zoom: 14,
          essential: true
        });
      }
    }
  }, [filters.location]);

  // Handle other filter changes that might affect the map
  useEffect(() => {
    // This is where you would update the map based on other filters
    // For example, if you have category filters, price filters, etc.
    console.log('Filters updated:', filters);

    // Example: If you have data points to display based on filters
    if (filters.category || filters.price || filters.date) {
      // Fetch or filter data points based on the current filters
      fetchFilteredDataPoints();
    }
  }, [filters]);

  // Example function to fetch data points based on current filters
  const fetchFilteredDataPoints = async () => {
    try {
      // This is a placeholder - replace with your actual data fetching logic
      // const response = await fetch('/api/data-points', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filters)
      // });
      // const data = await response.json();

      // For now, let's use dummy data
      const dummyData = [
        { id: 1, coordinates: [34.81, 32.10], title: 'Point 1' },
        { id: 2, coordinates: [34.82, 32.11], title: 'Point 2' },
        // Add more points as needed
      ];

      // Update markers state to trigger re-render with new markers
      setMarkers(dummyData);
    } catch (error) {
      console.error('Error fetching data points:', error);
    }
  };

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
        // minWidth: '300px',
      }}
      center={center}
      zoom={zoom}
      onStyleLoad={onMapLoad}
    >
      {/* Location marker from filters */}
      {filters.location && (
        <Marker
          coordinates={filters.location.coordinates}
          anchor="bottom"
        >
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </Marker>
      )}

      {/* Display markers based on other filters */}
      {markers.map(marker => (
        <Marker
          key={marker.id}
          coordinates={marker.coordinates}
          anchor="bottom"
        >
          <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center"
            title={marker.title}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </Marker>
      ))}
    </Map>
  );
}
