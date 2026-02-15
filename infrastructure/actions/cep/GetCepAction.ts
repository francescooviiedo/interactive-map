'use server';

import { cepService } from "@/data/services/cep.service"; 

export default async function GetCepAction(cep: string) {
    return await cepService.getAddressByCep(cep);
}