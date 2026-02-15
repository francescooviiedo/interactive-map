import { fetchData } from "@/data/api/httpClient";

class EventosService {
    async saveEvent(novoEvento: unknown) {
        try {
            return await fetchData('http://localhost:3000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoEvento)
            });
        } catch (error) {
            console.warn('Erro ao salvar evento:', error);
        }
    }
}

export const eventosService = new EventosService();