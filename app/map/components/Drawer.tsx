import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useAppThemeMode } from '@/app/theme/ThemeProvider';

type DrawerEvent = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
};

type Props = Readonly<{
  children: React.ReactNode;
  events: DrawerEvent[];
  selectedEventId: number | null;
  onSelectEvent: (eventId: number) => void;
}>;

const drawerWidth = 420;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({ children, events, selectedEventId, onSelectEvent }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { mode, toggleMode } = useAppThemeMode();
  const layoutOpen = open && !isMobile;
  const responsiveDrawerWidth = isMobile ? '88vw' : `${drawerWidth}px`;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <AppBar position="fixed" open={layoutOpen}>
        <Toolbar>
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="neon-text" sx={{ color: 'primary.main' }}>
            🎉 Eventos
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="default"
            onClick={toggleMode}
            className="neon-border"
            aria-label="toggle theme"
            sx={{ color: 'text.primary' }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: responsiveDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: responsiveDrawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'text.primary' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Chip
            size="small"
            label={`${events.length} eventos disponíveis`}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600 }}
          />
        </Box>
        <List sx={{ px: 2, pb: 1, overflowY: 'auto', flexGrow: 1, display: 'grid', gap: 1.25 }}>
          {events.map((event) => {
            const isSelected = selectedEventId === event.id;
            return (
              <ListItem key={event.id} disablePadding>
                <Paper
                  onClick={() => {
                    onSelectEvent(event.id);
                    if (isMobile) {
                      setOpen(false);
                    }
                  }}
                  className={isSelected ? 'neon-border' : ''}
                  sx={{
                    width: '100%',
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: isSelected ? 'rgba(255, 31, 149, 0.12)' : 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(255, 31, 149, 0.08)',
                    },
                  }}
                >
                  <Stack spacing={0.7}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {event.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {event.endereco}, {event.numero} - {event.bairro}, {event.cidade}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        Evento cadastrado
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <ListItem disablePadding>
            <ListItemButton className="neon-glow" onClick={() => router.push('/criar-evento')} sx={{ minHeight: 44 }}>
              <ListItemIcon>
                <AddIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Adicionar Evento" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
      <Main open={layoutOpen}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
