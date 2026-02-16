'use client';
import { Box, Button, Stack, Typography } from '@mui/material';
import { APIProvider, InfoWindow, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import PersistentDrawerLeft from './Drawer';
import { useEffect, useMemo, useState } from 'react';
import { useAppThemeMode } from '@/app/theme/ThemeProvider';
import { useRouter } from 'next/navigation';
import PlaceIcon from '@mui/icons-material/Place';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

type MapEvent = {
    id: number;
    name: string;
    image_url?: string | null;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    lat: number;
    lng: number;
};

function mapApiEvent(input: unknown): MapEvent | null {
    if (!input || typeof input !== 'object') {
        return null;
    }

    const event = input as Partial<MapEvent> & { lat?: unknown; lng?: unknown };
    const lat = Number(event.lat);
    const lng = Number(event.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
    }

    return {
        id: Number(event.id),
        name: String(event.name ?? 'Evento sem nome'),
        image_url: event.image_url ?? null,
        endereco: String(event.endereco ?? ''),
        numero: String(event.numero ?? ''),
        bairro: String(event.bairro ?? ''),
        cidade: String(event.cidade ?? ''),
        lat,
        lng,
    };
}

const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#1d1620' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#e0bedf' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1620' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#4f3654' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#f5d8f3' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d6a0d4' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#2a2230' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3a2a41' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2a1f30' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#f3d5ef' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#7a2d65' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#542047' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f2440' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1f1a2c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#c797c2' }] },
];

const lightMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#fff6fd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6c3f62' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#e9bfdc' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#ffe5f4' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8f4a7d' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#f7e6f3' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#f2cde4' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98507f' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffc8e7' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#f6acd7' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#fce3f3' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#f2d8f0' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8f4a7d' }] },
];

type CameraControllerProps = {
    selectedEvent: MapEvent | null;
};

function CameraController({ selectedEvent }: CameraControllerProps) {
    const map = useMap();

    useEffect(() => {
        if (!map || !selectedEvent) {
            return;
        }

        map.panTo({ lat: selectedEvent.lat, lng: selectedEvent.lng });
        map.setZoom(Math.max(map.getZoom() ?? 13, 16));
    }, [map, selectedEvent]);

    return null;
}

export default function MapContext() {
    const markerPosition = { lat: -19.9208, lng: -43.9378 };
    const [events, setEvents] = useState<MapEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const { mode } = useAppThemeMode();
    const router = useRouter();

    useEffect(() => {
        async function fetchEvents() {
            const res = await fetch('/api/events');
            if (res.ok) {
                const data = (await res.json()) as unknown[];
                const validEvents = data.map(mapApiEvent).filter((event): event is MapEvent => event !== null);
                setEvents(validEvents);
            }
        }
        fetchEvents();
    }, []);

    const selectedEvent = useMemo(
        () => events.find((event) => event.id === selectedEventId) ?? null,
        [events, selectedEventId],
    );

    return (
        <PersistentDrawerLeft
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
        >
            <APIProvider apiKey={API_KEY}>
                <Map
                    key={mode}
                    style={{ width: '100%', height: 'min(85vh, calc(100dvh - 110px))', minHeight: 300 }}
                    defaultCenter={markerPosition}
                    defaultZoom={13}
                    gestureHandling='greedy'
                    disableDefaultUI
                    styles={mode === 'dark' ? darkMapStyles : lightMapStyles}
                >
                    <CameraController selectedEvent={selectedEvent} />
                    {events.map((event) => (
                        <Box key={event.id}>
                            <Marker 
                                position={{ lat: event.lat, lng: event.lng }}
                                onClick={() => setSelectedEventId(event.id)}
                            />
                            {selectedEventId === event.id && (
                                <InfoWindow position={{ lat: event.lat, lng: event.lng }} onCloseClick={() => setSelectedEventId(null)}>
                                    <Box className="glass" sx={{ width: 280, borderRadius: 2, overflow: 'hidden' }}>
                                        {event.image_url && (
                                            <Box
                                                sx={{
                                                    height: 112,
                                                    backgroundImage: `url(${event.image_url})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                        )}
                                        <Stack spacing={1.1} sx={{ p: 1.6 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }} className="neon-text">
                                                {event.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <PlaceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {event.endereco}, {event.numero} - {event.bairro}, {event.cidade}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                className="neon-glow"
                                                onClick={() => router.push(`/evento/${event.id}`)}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </Stack>
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