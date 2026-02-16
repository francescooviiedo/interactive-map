'use client';

import getEventByIdAction from '@/infrastructure/actions/eventos/getEventByIdAction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceIcon from '@mui/icons-material/Place';
import TagIcon from '@mui/icons-material/Tag';
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type EventDetail = {
  id: number;
  name: string;
  description: string;
  initial_date: string;
  final_date: string;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
};

type Props = Readonly<{
  eventId: number;
}>;

export default function Context({ eventId }: Props) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      const response = (await getEventByIdAction(eventId)) as EventDetail | { error: string } | null;

      if (!response || 'error' in response) {
        setEvent(null);
        setLoading(false);
        return;
      }

      setEvent(response);
      setLoading(false);
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper className="glass" sx={{ borderRadius: 3, p: 3 }}>
          <Typography color="text.secondary">Carregando detalhes...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper className="glass" sx={{ borderRadius: 3, p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Evento não encontrado</Typography>
            <Button component={Link} href="/map" variant="outlined" startIcon={<ArrowBackIcon />}>
              Voltar para o mapa
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const address = `${event.endereco ?? ''}, ${event.numero ?? ''} - ${event.bairro ?? ''}, ${event.cidade ?? ''}`;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper className="glass" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {event.image_url ? (
          <Box
            sx={{
              height: 240,
              backgroundImage: `url(${event.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(13, 7, 16, 0.65), rgba(13, 7, 16, 0.15), rgba(13, 7, 16, 0.05))',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: 160,
              background:
                'radial-gradient(circle at 20% 20%, rgba(255, 31, 149, 0.28), transparent 42%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.25), transparent 35%)',
            }}
          />
        )}

        <Stack spacing={2.2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }} className="neon-text">
              {event.name}
            </Typography>
            <Chip icon={<TagIcon />} label={`#${event.id}`} color="primary" variant="filled" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaceIcon color="primary" />
            <Typography variant="body1" color="text.secondary">
              {address}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            CEP: {event.cep ?? '-'}
          </Typography>

          <Typography variant="body1">{event.description}</Typography>

          <Typography variant="body2" color="text.secondary">
            Início: {new Date(event.initial_date).toLocaleString('pt-BR')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Fim: {new Date(event.final_date).toLocaleString('pt-BR')}
          </Typography>

          {(event.lat !== null || event.lng !== null) && (
            <Typography variant="body2" color="text.secondary">
              Localização: {event.lat ?? '-'}, {event.lng ?? '-'}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, pt: 1 }}>
            <Button component={Link} href="/map" variant="outlined" startIcon={<ArrowBackIcon />}>
              Voltar para o mapa
            </Button>
            <Button component={Link} href="/criar-evento" variant="contained" className="neon-glow">
              Criar novo evento
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
