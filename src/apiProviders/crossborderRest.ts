import { request, APIRequestContext } from '@playwright/test'
import { environment } from '@config/environment'
// import crearEnvioBodyJson from '@/testData/archivosJson/crearEnvioBody.json'
// import { CrearEnvioBody } from '@/types/crearEnvioInterfaces'

export class CrossBorderRest {
    private baseUrl?: APIRequestContext

    async init() {
        this.baseUrl = await request.newContext({
            extraHTTPHeaders: {
                'Content-Type': 'application/json'
            },
            baseURL: environment.apiBaseUrlCrossborderDev
        })

        return this
    }

    public async getToken(token: string) {
        const getToken = await this.baseUrl!.post('/api/oauth/token', {
            headers: {
                Authorization: `Basic ${token}`
            },
            data: {
                grant_type: 'client_credentials'
            }
        })

        return getToken
    }

    //   public async postCrearEnvio(
    //     token: string,
    //     codigoOptitrack: number,
    //     idSede: number,
    //     idOficina: number,
    //     direccion: string,
    //     consignado: string,
    //     idUbigeo: number
    //   ) {
    //     // Clonar el JSON para evitar mutaciones globales
    //     const body = { ...crearEnvioBodyJson }

    //     // Sobrescribir solo los campos necesarios
    //     body.codigoOptitrack = codigoOptitrack
    //     body.idSede = idSede
    //     body.idOficina = idOficina
    //     body.direccionEntrega = direccion
    //     body.consignado = consignado
    //     body.idUbigeo = idUbigeo

    //     const getResponse = await this.baseUrl!.post('/envioRest/webresources/envio/crear', {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       },
    //       data: body
    //     })

    //     return getResponse
    //   }

    //   public async postCrearMultiplesEnvios(token: string, listaDeEnvios: CrearEnvioBody[]) {
    //     return await this.baseUrl!.post('/envioRest/webresources/envio/crear', {
    //       data: listaDeEnvios,
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     })
    //   }
}
