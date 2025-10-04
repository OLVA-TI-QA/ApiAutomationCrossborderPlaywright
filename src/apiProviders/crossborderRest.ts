import { request, APIRequestContext } from '@playwright/test'
import { environment } from '@config/environment'
import parcelDeclareRequest from '@/testData/archivosJson/parcelDeclareRequest.json'
import parcelDeclareRequest200Items from '@/testData/archivosJson/Parcel_items_200.json'
import parcelDeclareRequest201Items from '@/testData/archivosJson/Parcel_items_201.json'
import parcelDeclareRequest1Items from '@/testData/archivosJson/Parcel_items_1.json'
import { ParcelDeclareRequestBody, testType } from '@/types/Interfaces'
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
        console.log(`wayBillNo generado: ${wayBillNo}`)
        // Clonar el JSON para evitar mutaciones globales
        const body = { ...parcelDeclareRequest, wayBillNo }

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
        const body = { ...parcelDeclareRequest, wayBillNo }

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

    public async postCrearParcelMasivo(token: string, bodyRequest: ParcelDeclareRequestBody) {
        // console.log('Body request:', bodyRequest)
        const getResponse = await this.baseUrl!.post('/crossborder-hub/api/parcels', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: bodyRequest
        })

        //Log response details for debugging
        if (!getResponse.ok()) {
            const errorBody = await getResponse.text()
            console.log('Error response:', errorBody)
        }

        return getResponse
    }

    public async postCrearParcel200Items(testTypes: testType, wayBillNo: string, token?: string) {
        console.log(`wayBillNo generado: ${wayBillNo}`)

        const body = (testTypes === testType.doscientosItemsList) ?
            { ...parcelDeclareRequest200Items, wayBillNo } :
            (testTypes === testType.doscientosUnoItemsList) ?
                { ...parcelDeclareRequest201Items, wayBillNo } :
                { ...parcelDeclareRequest1Items, wayBillNo }

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

    // public async postCrearMultiplesEnvios(token: string, listaDeEnvios: CrearEnvioBody[]) {
    //     return await this.baseUrl!.post('/envioRest/webresources/envio/crear', {
    //         data: listaDeEnvios,
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    // }
}
