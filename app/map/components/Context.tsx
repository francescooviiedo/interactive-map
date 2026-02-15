'use client';
import { Box } from '@mui/material';
import {APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';
import PersistentDrawerLeft from './Drawer';
import { useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapContext() {
   
 
    const [open, setOpen] = useState(false);
    const markerPosition = { lat: -19.9208, lng: -43.9378 };

    return (
        <PersistentDrawerLeft>
            <APIProvider apiKey={API_KEY}>
                <Map
                    style={{width: '100%', height: '85vh'}}
                    defaultCenter={markerPosition}
                    defaultZoom={13}
                    gestureHandling='greedy'
                    disableDefaultUI
                >
                    <Marker 
                        position={markerPosition} 
                        onClick={() => setOpen(true)}
                    />
                    {open && (
                        <InfoWindow position={markerPosition} onCloseClick={() => setOpen(false)}>
                            <Box p={2}>
                                <strong>Marker Info</strong>
                                <div>This is a pin in Belo Horizonte!</div>
                            </Box>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </PersistentDrawerLeft>
    );
}