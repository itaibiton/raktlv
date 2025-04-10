import { create } from 'zustand';
import mapboxgl from 'mapbox-gl';
import { Database } from '@/schema';
import { Feature, Polygon } from 'geojson';

// Define default map settings
export const DEFAULT_CENTER: [number, number] = [34.78057, 32.08088]; // Tel Aviv coordinates
export const DEFAULT_ZOOM = 12;

// Define Tel Aviv boundary coordinates
export const TEL_AVIV_COORDINATES = [
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

// Define extended bounds for the map
export const EXTENDED_BOUNDS = [
    [34.72, 32.02], // Southwest corner - extended beyond Tel Aviv
    [34.85, 32.14]  // Northeast corner - extended beyond Tel Aviv
];

// Create a GeoJSON polygon for the mask (area outside Tel Aviv)
export const MASK_POLYGON: Feature<Polygon> = {
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
            TEL_AVIV_COORDINATES
        ]
    },
    properties: {}
};

interface MapState {
    mapInstance: mapboxgl.Map | null;
    center: [number, number];
    zoom: number;
    markers: mapboxgl.Marker[];
    isRTLPluginInitialized: boolean;
}

interface MapActions {
    setMapInstance: (map: mapboxgl.Map) => void;
    setCenter: (center: [number, number]) => void;
    setZoom: (zoom: number) => void;
    addMarker: (coordinates: [number, number]) => void;
    clearMarkers: () => void;
    flyTo: (coordinates: [number, number], zoom?: number, duration?: number) => void;
    easeTo: (coordinates: [number, number], zoom?: number, duration?: number) => void;
    initializeRTLPlugin: () => void;
    customizeMapLayers: () => void;
    resetMap: () => void;
}

const initialState: MapState = {
    mapInstance: null,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    markers: [],
    isRTLPluginInitialized: false,
};

export const useMapStore = create<MapState & MapActions>((set, get) => ({
    ...initialState,

    setMapInstance: (map) => set({ mapInstance: map }),

    setCenter: (center) => set({ center }),

    setZoom: (zoom) => set({ zoom }),

    addMarker: (coordinates) => {
        const { mapInstance, markers } = get();
        if (!mapInstance) return;

        const newMarker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(mapInstance);

        set({ markers: [...markers, newMarker] });
    },

    clearMarkers: () => {
        const { markers } = get();
        markers.forEach(marker => marker.remove());
        set({ markers: [] });
    },

    flyTo: (coordinates, zoom = 17, duration = 1500) => {
        const { mapInstance } = get();
        if (!mapInstance) return;

        // First zoom out slightly for better animation
        mapInstance.easeTo({
            zoom: Math.max(mapInstance.getZoom() - 2, 10),
            duration: 300
        });

        // Then fly to the target location
        setTimeout(() => {
            mapInstance.flyTo({
                center: coordinates,
                zoom,
                essential: true,
                duration,
                curve: 1.5
            });
        }, 350);
    },

    easeTo: (coordinates, zoom = DEFAULT_ZOOM, duration = 1500) => {
        const { mapInstance } = get();
        if (!mapInstance) return;

        mapInstance.easeTo({
            center: coordinates,
            zoom,
            duration
        });
    },

    initializeRTLPlugin: () => {
        const { isRTLPluginInitialized } = get();
        if (isRTLPluginInitialized) return;

        // @ts-ignore - the mapboxgl types don't include the RTL plugin
        if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
            // @ts-ignore
            mapboxgl.setRTLTextPlugin(
                'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
                null!,
                true // Lazy load the plugin
            );
        }

        set({ isRTLPluginInitialized: true });
    },

    customizeMapLayers: () => {
        const { mapInstance } = get();
        if (!mapInstance) return;

        // Add the mask source and layer
        mapInstance.addSource('outside-tel-aviv', {
            type: 'geojson',
            data: MASK_POLYGON
        });

        mapInstance.addLayer({
            id: 'outside-tel-aviv-mask',
            type: 'fill',
            source: 'outside-tel-aviv',
            paint: {
                'fill-color': '#cccccc',
                'fill-opacity': 0.7
            }
        }, 'road-label'); // Insert before labels so text remains visible

        // Add a border around Tel Aviv
        mapInstance.addLayer({
            id: 'tel-aviv-border',
            type: 'line',
            source: 'outside-tel-aviv',
            paint: {
                'line-color': '#0078ff',
                'line-width': 2
            },
            filter: ['==', '$type', 'Polygon']
        });

        // Set Hebrew for all text layers
        const layers = mapInstance.getStyle().layers;
        layers.forEach((layer: any) => {
            if (layer.type === 'symbol' &&
                mapInstance.getLayoutProperty(layer.id, 'text-field') !== undefined) {
                try {
                    if (mapInstance.getLayoutProperty(layer.id, 'text-field')) {
                        mapInstance.setLayoutProperty(layer.id, 'text-field', ['coalesce',
                            ['get', 'name_he'],
                            ['get', 'name:he'],
                            ['get', 'name_hebrew'],
                            ['get', 'name:hebrew'],
                            ['get', 'name']
                        ]);
                    }
                } catch (e) {
                    // Silently handle errors for layers that don't support text-field
                }
            }
        });

        // Force RTL text direction for all symbol layers
        layers.forEach((layer: any) => {
            if (layer.type === 'symbol') {
                try {
                    mapInstance.setLayoutProperty(layer.id, 'text-letter-spacing', 0.1);
                } catch (e) {
                    // Silently handle errors for layers that don't support text-letter-spacing
                }
            }
        });
    },

    resetMap: () => {
        const { mapInstance } = get();
        if (!mapInstance) return;

        // Just clear markers without changing the center or zoom
        get().clearMarkers();
    },
})); 