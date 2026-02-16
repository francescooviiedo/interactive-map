import { fetchData } from "../../api/httpClient";

export type ViaCepAddress = {
    cep: string;
    logradouro: string;
    complemento: string;
    unidade: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    regiao: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
};

class CepService {
    private readonly apiUrl = 'https://viacep.com.br/ws';

    async getAddressByCep(cep: string): Promise<ViaCepAddress> {
        try {
            const response = await fetchData(`${this.apiUrl}/${cep}/json/`, {
                method: 'GET',
                body: null,
            });

            if (!response) {
                throw new Error('Erro ao buscar o endereço');
            }

            return response as ViaCepAddress;
        } 
        catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
}

export const cepService = new CepService();