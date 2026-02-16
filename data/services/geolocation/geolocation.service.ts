/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchData } from "@/data/api/httpClient";

type Results = {
    address_components: any[];
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    }
}

type GeolocationResponse = {
    results: Results[];
    status: string;
}
class GeolocationService{
    async getPositionFromAddress(fullAddress: string){
         try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
                const geoRes = await fetchData<GeolocationResponse>(geocodeUrl, {
                    method: 'GET',
                    body: null,
                });

                if (geoRes && geoRes.results.length > 0) {
                    const location = geoRes.results[0].geometry.location;
                    return location
                } 
            } catch (error) {
                console.warn('Erro ao obter a geolocalização do endereço:', error);
                return null
            }
    }
}

export const geolocationService = new GeolocationService();