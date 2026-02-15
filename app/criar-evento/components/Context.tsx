'use client';
import GetCepAction from "@/infrastructure/actions/cep/GetCepAction";
import GetGeolocationAction from "@/infrastructure/actions/geolocation/getGelocationAction";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import saveEventAction from "@/infrastructure/actions/eventos/saveEventAction";

export default function Context() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [eventName, setEventName] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [fullAddress, setFullAddress] = useState('');
    const getAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCep = e.target.value.replaceAll(/\D/g, '');
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
            const fullAddress = `${respone.logradouro}, ${respone.bairro}, ${respone.localidade}, Brasil`;
            setFullAddress(fullAddress);
        }
    };

    const hadleSaveEvent = async () => {
        const fullAddress = `${endereco},${numero} - ${bairro}, ${cidade}, Brasil`;
        const location = await GetGeolocationAction(fullAddress);
            setLat(location.lat);
            setLng(location.lng);

        console.log('Full Address para geolocalização:', fullAddress);
        const novoEvento = {
            name: eventName,
            address: {
                cep,
                endereco,
                numero,
                bairro,
                cidade
            },
            location: {
                lat,
                lng
            }
        };
       await saveEventAction(novoEvento);
    }

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
            <Button variant="contained" endIcon={<SendIcon />} onClick={hadleSaveEvent} sx={{ mt: 3 }}>
                 Send
            </Button>
        </Box>
    );
}