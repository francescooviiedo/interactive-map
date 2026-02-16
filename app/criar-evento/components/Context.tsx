'use client';
import GetCepAction from "@/infrastructure/actions/cep/GetCepAction";
import GetGeolocationAction from "@/infrastructure/actions/geolocation/getGelocationAction";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type FormErrors = {
    eventName?: string;
    description?: string;
    initialDateTime?: string;
    finalDateTime?: string;
    image?: string;
};

function isIsoDate(value: string): boolean {
    if (!value) {
        return false;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return false;
    }

    return parsed.toISOString() === value;
}

export default function Context() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [initialDateTime, setInitialDateTime] = useState<Dayjs | null>(null);
    const [finalDateTime, setFinalDateTime] = useState<Dayjs | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [requestError, setRequestError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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
            const response = await GetCepAction(rawCep);
            setEndereco(response.logradouro);
            setBairro(response.bairro);
            setCidade(response.localidade);
        }
    };

    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        if (!eventName.trim()) {
            errors.eventName = 'Nome do evento é obrigatório.';
        }

        if (!description.trim()) {
            errors.description = 'Descrição do evento é obrigatória.';
        }

        const initialIso = initialDateTime?.toDate().toISOString() ?? '';
        const finalIso = finalDateTime?.toDate().toISOString() ?? '';

        if (!isIsoDate(initialIso)) {
            errors.initialDateTime = 'Data inicial obrigatória em formato válido.';
        }

        if (!isIsoDate(finalIso)) {
            errors.finalDateTime = 'Data final obrigatória em formato válido.';
        }

        if (!errors.initialDateTime && !errors.finalDateTime && finalDateTime?.isBefore(initialDateTime)) {
            errors.finalDateTime = 'A data final não pode ser anterior à data inicial.';
        }

        if (imageFile && !ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
            errors.image = 'Formato inválido. Use JPG, PNG ou WEBP.';
        }

        return errors;
    };

    const hadleSaveEvent = async () => {
        setRequestError(null);
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsSaving(true);
        const fullAddress = `${endereco},${numero} - ${bairro}, ${cidade}, Brasil`;
        try {
            const location = await GetGeolocationAction(fullAddress);
            const payload = new FormData();

            payload.set('name', eventName.trim());
            payload.set('description', description.trim());
            payload.set('initial_date', initialDateTime!.toDate().toISOString());
            payload.set('final_date', finalDateTime!.toDate().toISOString());
            payload.set('cep', cep);
            payload.set('endereco', endereco);
            payload.set('numero', numero);
            payload.set('bairro', bairro);
            payload.set('cidade', cidade);
            payload.set('lat', String(location!.lat));
            payload.set('lng', String(location!.lng));

            if (imageFile) {
                payload.set('image', imageFile);
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                body: payload,
            });

            if (!response.ok) {
                const body = (await response.json()) as { error?: string };
                setRequestError(body.error ?? 'Falha ao salvar evento.');
                return;
            }

            setEventName('');
            setDescription('');
            setInitialDateTime(null);
            setFinalDateTime(null);
            setImageFile(null);
            setImagePreview(null);
            setFormErrors({});
        } catch {
            setRequestError('Erro inesperado ao salvar evento.');
        } finally {
            setIsSaving(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            setFormErrors((previous) => ({ ...previous, image: 'Formato inválido. Use JPG, PNG ou WEBP.' }));
            return;
        }

        setImageFile(file);
        setFormErrors((previous) => ({ ...previous, image: undefined }));
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
            <Paper
                className="glass"
                sx={{
                    width: '100%',
                    maxWidth: 560,
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Criar Evento
                    </Typography>
                    {requestError && <Alert severity="error">{requestError}</Alert>}
                    <Box
                        sx={{
                            height: { xs: 150, sm: 180 },
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
                    <Button component="label" variant="outlined" startIcon={<ImageIcon />} sx={{ minHeight: 44 }}>
                        <Box component="span">Selecionar imagem</Box>
                        <input
                            hidden
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {formErrors.image && <Alert severity="warning">{formErrors.image}</Alert>}
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
                    error={Boolean(formErrors.eventName)}
                    helperText={formErrors.eventName}
                    fullWidth
                    />
                    <TextField
                    label="Descrição"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    error={Boolean(formErrors.description)}
                    helperText={formErrors.description}
                    multiline
                    minRows={4}
                    required
                    fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DateTimePicker
                            label="Data e hora inicial"
                            value={initialDateTime}
                            onChange={handleInitialDateTimeChange}
                            slotProps={{
                                textField: {
                                    error: Boolean(formErrors.initialDateTime),
                                    helperText: formErrors.initialDateTime,
                                    required: true,
                                },
                            }}
                            sx={{ width: '100%' }}
                        />
                        <DateTimePicker
                            label="Data e hora final"
                            value={finalDateTime}
                            onChange={handleFinalDateTimeChange}
                            minDateTime={initialDateTime ?? undefined}
                            slotProps={{
                                textField: {
                                    error: Boolean(formErrors.finalDateTime),
                                    helperText: formErrors.finalDateTime,
                                    required: true,
                                },
                            }}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                    <Button 
                        variant="contained"
                        endIcon={<SendIcon />} 
                        onClick={hadleSaveEvent}
                        className="neon-glow"
                        disabled={isSaving}
                        sx={{ minHeight: 46 }}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar evento'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}