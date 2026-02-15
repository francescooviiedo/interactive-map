import { fetchData } from "../../api/httpClient";

class CepService {
    private readonly apiUrl = 'https://viacep.com.br/ws';

    async getAddressByCep(cep: string) {
        try {
            const response = await fetchData(`${this.apiUrl}/${cep}/json/`, {
                method: 'GET',
                body: null,
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar o endereço');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
}

export const cepService = new CepService();