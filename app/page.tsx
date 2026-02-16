import { Box, Button } from "@mui/material";
import Image from "next/image";
export default function Home() {
  return (
   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Image src="/assets/images/logo.png" alt="Logo" width={200} height={200} />
      <Button variant="contained" color="primary" href="/criar-evento" sx={{ mt: 4 }}>
        Criar Evento
      </Button>
    </Box>
  );
}
