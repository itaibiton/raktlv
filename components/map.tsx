"use client"
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const Map = () => {

    const Map = ReactMapboxGl({
        accessToken:
            'pk.eyJ1IjoiaXRhaWJpdG9uIiwiYSI6ImNtN2NiMTJqYTBraHUya3M4eDNmNWU1aXQifQ.YllxRQgVm3dWlgOK18tocw'
    });


    return <div className="w-[800px] h-full rounded-md overflow-hidden hidden lg:flex">
        <Map
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
                height: '100%',
                width: '100%'
            }}
        >
            <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
            </Layer>
        </Map>
    </div>
}

export default Map;