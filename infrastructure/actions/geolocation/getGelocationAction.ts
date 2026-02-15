'use server';
import { geolocationService } from "@/data/services/geolocation/geolocation.service";
export default async function GetGeolocationAction(fullAddress: string) {
    return await geolocationService.getPositionFromAddress(fullAddress);
}