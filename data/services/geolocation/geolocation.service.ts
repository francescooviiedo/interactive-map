import { fetchData } from "@/data/api/httpClient";

class GeolocationService{
    async getPositionFromAddress(fullAddress: string){
         try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
                const geoRes = await fetchData(geocodeUrl, {
                    method: 'GET',
                    body: null,
                });
                const geoData = await geoRes.json();
                if (geoData.status === 'OK' && geoData.results.length > 0) {
                    const location = geoData.results[0].geometry.location;
                    return location
                } 
            } catch (error) {
                console.warn('Erro ao obter a geolocalização do endereço:', error);
                return null
            }
    }
}

export const geolocationService = new GeolocationService();