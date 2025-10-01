import { request, APIRequestContext } from '@playwright/test'
import { environment } from '@config/environment'
import parcelDeclareRequest from '@/testData/archivosJson/parcelDeclareRequest.json'
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

    public async postToken(token?: string) {
        const getToken = await this.baseUrl!.post('/crossborder-hub/api/oauth/token', {
            headers: {
                Authorization: `Basic ${token}`
            },
            data: {
                grant_type: 'client_credentials'
            }
        })

        return getToken
    }

    public async postTokenSinHeader() {
        const getToken = await this.baseUrl!.post('/crossborder-hub/api/oauth/token', {
            data: {
                grant_type: 'client_credentials'
            }
        })

        return getToken
    }

    public async postCrearParcel(wayBillNo: string, token?: string) {
        // Clonar el JSON para evitar mutaciones globales
        const body = { ...parcelDeclareRequest }

        // Sobrescribir solo los campos necesarios
        body.wayBillNo = wayBillNo

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: body
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postCrearParcelSinToken(wayBillNo: string) {
        // Clonar el JSON para evitar mutaciones globales
        const body = { ...parcelDeclareRequest }

        // Sobrescribir solo los campos necesarios
        body.wayBillNo = wayBillNo

        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            data: body
        })



        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    // public async postCrearMultiplesEnvios(token: string, listaDeEnvios: CrearEnvioBody[]) {
    //     return await this.baseUrl!.post('/envioRest/webresources/envio/crear', {
    //         data: listaDeEnvios,
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    // }
}
