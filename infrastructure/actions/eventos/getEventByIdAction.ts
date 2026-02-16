'use server';

import { eventosService } from '@/data/services/eventos/eventos.service';

export default async function getEventByIdAction(id: number) {
  return eventosService.getEventById(id);
}
