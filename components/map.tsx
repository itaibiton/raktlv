"use client";

// ES6
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useFilterStore } from '@/store/filter-store';
import { useMapStore, EXTENDED_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/store/map-store';
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

export default function MapComponent() {
  const { filters } = useFilterStore();
  const {
    setMapInstance,
    initializeRTLPlugin,
    customizeMapLayers,
    addMarker,
    clearMarkers,
    flyTo,
    easeTo,
    resetMap
  } = useMapStore();

  // Initialize RTL plugin and handle map load
  useEffect(() => {
    initializeRTLPlugin();
  }, [initializeRTLPlugin]);

  // Handle selected property changes
  useEffect(() => {
    if (filters.selectedProperty) {
      const propertyCoords: [number, number] = [
        filters.selectedProperty.longitude!,
        filters.selectedProperty.latitude!
      ];

      clearMarkers();
      addMarker(propertyCoords);
      flyTo(propertyCoords, 17);
    } else if (filters.location?.coordinates) {
      // When property is deselected, restore the previous search location
      clearMarkers();
      addMarker(filters.location.coordinates);

      // Don't zoom if this is the default location (from a reset)
      const isDefaultLocation =
        filters.location.coordinates[0] === DEFAULT_CENTER[0] &&
        filters.location.coordinates[1] === DEFAULT_CENTER[1];

      if (!isDefaultLocation) {
        flyTo(filters.location.coordinates, 15);
      } else {
        easeTo(filters.location.coordinates);
      }
    }
  }, [filters.selectedProperty, filters.location, clearMarkers, addMarker, flyTo, easeTo]);

  // Handle location filter changes
  useEffect(() => {
    if (filters.location?.coordinates && !filters.selectedProperty) {
      clearMarkers();
      addMarker(filters.location.coordinates);

      // Don't zoom if this is the default location (from a reset)
      const isDefaultLocation =
        filters.location.coordinates[0] === DEFAULT_CENTER[0] &&
        filters.location.coordinates[1] === DEFAULT_CENTER[1];

      if (!isDefaultLocation) {
        flyTo(filters.location.coordinates, 15);
      } else {
        easeTo(filters.location.coordinates);
      }
    }
  }, [filters.location, filters.selectedProperty, clearMarkers, addMarker, flyTo, easeTo]);

  // Handle filter resets
  useEffect(() => {
    // When filters are reset, set the map to default center and zoom
    if (filters.location?.coordinates[0] === DEFAULT_CENTER[0] &&
      filters.location.coordinates[1] === DEFAULT_CENTER[1]) {

      clearMarkers();

      // Reset map to default center and zoom
      const mapInstance = useMapStore.getState().mapInstance;
      if (mapInstance) {
        mapInstance.easeTo({
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          duration: 1000
        });
      }
    }
  }, [filters, clearMarkers]);

  const onMapLoad = (map: mapboxgl.Map) => {
    setMapInstance(map);
    customizeMapLayers();
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
      maxBounds={EXTENDED_BOUNDS as any}
    >
    </Map>
  );
}
