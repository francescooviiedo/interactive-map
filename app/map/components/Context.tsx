/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Box } from '@mui/material';
import {APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';
import PersistentDrawerLeft from './Drawer';
import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapContext() {
    const markerPosition = { lat: -19.9208, lng: -43.9378 };
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            const res = await fetch('/api/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        }
        fetchEvents();
    }, []);
    console.log('Eventos recebidos no MapContext:', events);
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
                    {events.map((event: any) => (
                        <Box key={event.id}>
                            <Marker 
                                position={{ lat: event.lat, lng: event.lng }}
                                onClick={() => setSelectedEventId(event.id)}
                            />
                            {selectedEventId === event.id && (
                                <InfoWindow position={{ lat: event.lat, lng: event.lng }} onCloseClick={() => setSelectedEventId(null)}>
                                    <Box p={2}>
                                        <strong>{event.name}</strong>
                                        <div>{event.endereco}, {event.numero}</div>
                                        <div>{event.bairro}, {event.cidade}</div>
                                        <div>Lat: {event.lat}, Lng: {event.lng}</div>
                                    </Box>
                                </InfoWindow>
                            )}
                        </Box>
                    ))}
                </Map>
            </APIProvider>
        </PersistentDrawerLeft>
    );
}