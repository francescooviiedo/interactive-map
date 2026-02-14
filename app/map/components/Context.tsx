'use client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapContext() {
    return (
        <APIProvider apiKey={API_KEY}>
            <Map
            style={{width: '100vw', height: '100vh'}}
            defaultCenter={{lat: -19.9208, lng: -43.9378}}
            defaultZoom={13}
            gestureHandling='greedy'
            disableDefaultUI
            />
        </APIProvider>
    );
}