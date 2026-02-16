'use client';
import GetCepAction from "@/infrastructure/actions/cep/GetCepAction";
import GetGeolocationAction from "@/infrastructure/actions/geolocation/getGelocationAction";
import { Box, Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import saveEventAction from "@/infrastructure/actions/eventos/saveEventAction";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

export default function Context() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [eventName, setEventName] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [initialDateTime, setInitialDateTime] = useState<Dayjs | null>(null);
    const [finalDateTime, setFinalDateTime] = useState<Dayjs | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInitialDateTimeChange = (newValue: Dayjs | null) => {
        setInitialDateTime(newValue);
        if (finalDateTime?.isBefore(newValue)) {
            setFinalDateTime(newValue);
        }
    };
    const handleFinalDateTimeChange = (newValue: Dayjs | null) => {
        if (newValue?.isBefore(initialDateTime)) {
            setFinalDateTime(initialDateTime);
        } else {
            setFinalDateTime(newValue);
        }
    };
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
        }
    };

    const hadleSaveEvent = async () => {
        const fullAddress = `${endereco},${numero} - ${bairro}, ${cidade}, Brasil`;
        const location = await GetGeolocationAction(fullAddress);
        const novoEvento = {
            name: eventName,
            imageUrl: imagePreview,
            address: {
                cep,
                endereco,
                numero,
                bairro,
                cidade
            },
            location: {
                lat: location.lat,
                lng: location.lng
            }
        };
       await saveEventAction(novoEvento);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                setImagePreview(result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                py: 4,
                px: 2,
             }}
            >
            {imagePreview && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${imagePreview})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(26px)',
                        transform: 'scale(1.08)',
                        opacity: 0.25,
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
            )}
            <Paper className="glass" sx={{ width: '100%', maxWidth: 520, p: 3, borderRadius: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box
                        sx={{
                            height: 180,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'end',
                            p: 1.5,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                backdropFilter: 'blur(6px)',
                                bgcolor: 'rgba(0,0,0,0.35)',
                            }}
                        >
                            <Box component="span" sx={{ fontSize: 13, color: 'white', fontWeight: 600 }}>
                                {imagePreview ? 'Header do evento' : 'Selecione uma imagem para o header'}
                            </Box>
                        </Box>
                    </Box>
                    <Button component="label" variant="outlined" startIcon={<ImageIcon />}>
                        Selecionar imagem
                        <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    </Button>
                    <TextField 
                    label="CEP" 
                    value={cep}
                    onChange={getAddress}
                    fullWidth
                    />
                    <TextField 
                    label="Endereço" 
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                    fullWidth
                    />
                    <TextField 
                    label="Bairro" 
                    value={bairro}
                    onChange={e => setBairro(e.target.value)}
                    fullWidth
                    />
                    <TextField 
                    label="Cidade" 
                    value={cidade}
                    onChange={e => setCidade(e.target.value)}
                    fullWidth
                    />
                    <TextField 
                    label="Numero" 
                    value={numero}
                    onChange={e => setNumero(e.target.value)}
                    fullWidth
                    />
                    <TextField 
                    label="Nome do Evento" 
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DateTimePicker
                            label="Data e hora inicial"
                            value={initialDateTime}
                            onChange={handleInitialDateTimeChange}
                            sx={{ width: '100%' }}
                        />
                        <DateTimePicker
                            label="Data e hora final"
                            value={finalDateTime}
                            onChange={handleFinalDateTimeChange}
                            minDateTime={initialDateTime ?? undefined}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                    <Button 
                        variant="contained"
                        endIcon={<SendIcon />} 
                        onClick={hadleSaveEvent}
                        className="neon-glow"
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}