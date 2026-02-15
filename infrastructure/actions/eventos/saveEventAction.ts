'use server';

import { eventosService } from "@/data/services/eventos/eventos.service";

export default async function saveEventAction(data: unknown) {
    eventosService.saveEvent(data);
}