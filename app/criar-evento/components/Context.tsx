'use client';
import GetCepAction from "@/infrastructure/actions/cep/GetCepAction";
import { Box, TextField } from "@mui/material";
import { useState } from "react";

export default function Context() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [eventName, setEventName] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const getAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCep = e.target.value.replace(/\D/g, '');
        let maskedCep = rawCep;
        if (rawCep.length > 5) {
            maskedCep = rawCep.slice(0, 5) + '-' + rawCep.slice(5, 8);
        }
        setCep(maskedCep);
        if (rawCep.length === 8) {
            const respone = await GetCepAction(rawCep);
            setEndereco(respone.logradouro);
            setBairro(respone.bairro);
            setCidade(respone.localidade);

            // Build full address string for geocoding
            const fullAddress = `${respone.logradouro}, ${respone.bairro}, ${respone.localidade}, Brasil`;
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
                const geoRes = await fetch(geocodeUrl);
                const geoData = await geoRes.json();
                console.log('Geocoding response:', geoData); // Debug log
                if (geoData.status === 'OK' && geoData.results.length > 0) {
                    const location = geoData.results[0].geometry.location;
                    setLat(location.lat);
                    setLng(location.lng);
                } else {
                    setLat(null);
                    setLng(null);
                }
            } catch (error) {
                setLat(null);
                setLng(null);
            }
        }
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f0f0f0' }}>
            {/* Debug: Show coordinates if available */}
            {lat && lng && (
                <Box sx={{ mt: 2, color: 'green' }}>
                    Latitude: {lat}, Longitude: {lng}
                </Box>
            )}
            <TextField 
            label="CEP" 
            variant="outlined" 
            sx={{ mt: 2 }} 
            value={cep}
            onChange={getAddress}
            />
             <TextField 
            label="Endereço" 
            variant="outlined" 
            sx={{ mt: 2 }} 
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            />
             <TextField 
            label="Bairro" 
            variant="outlined" 
            sx={{ mt: 2 }} 
            value={bairro}
            onChange={e => setBairro(e.target.value)}
            />
             <TextField 
            label="Cidade" 
            variant="outlined" 
            sx={{ mt: 2 }} 
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            />
             <TextField 
            label="Numero" 
            variant="outlined" 
            sx={{ mt: 2 }} 
            value={numero}
            onChange={e => setNumero(e.target.value)}
            />
             <TextField 
            label="Nome do Evento" 
            variant="outlined"
            sx={{ mt: 2 }} 
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            />
        </Box>
    );
}