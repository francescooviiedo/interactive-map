class EventosService {
    async saveEvent(novoEvento: unknown) {
 try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoEvento)
            });
            if (response.ok) {
                const data = await response.json();
                alert('Evento salvo com sucesso! ID: ' + data.id);
            } 
        } catch (error) {
            console.warn('Erro ao salvar evento:', error);
        }
    }
}

export const eventosService = new EventosService();