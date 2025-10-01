import { expect, test } from '@playwright/test'
import { CrossBorderRest } from '@/apiProviders/crossborderRest'
import { tokenType } from '@/types/Interfaces'
import { generateRandomAWB } from '@/utils/helpers'

let crossBorderRest: CrossBorderRest

// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})

test('TC-SEGU-API-01: Acceso OK', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: "Bearer"
        });
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const crearParcelResponse = await crossBorderRest.postCrearParcel(token, generateRandomAWB())
        expect(crearParcelResponse.status()).toBe(201)
        expect(crearParcelResponse.json()).toMatchObject({
            status: 'CREATED',
            message: 'Parcel created successfully'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-02: Token Ausente', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcelSinToken('AWBN056835492')
        expect(crearParcelResponse.status()).toBe(403)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-03: Duplicado de parcel', async () => {
    try {
        const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)

        expect(getTokenResponse.status()).toBe(200)
        expect(getTokenResponse.json()).resolves.toMatchObject({
            access_token: expect.any(String),
            token_type: "Bearer"
        });
        console.log(getTokenResponse.json())

        const authBody = await getTokenResponse.json()
        const token = authBody.access_token
        expect(token).toBeDefined()
        console.log(`🔐 Token obtenido: ${token}`)

        const guiaDuplicada = 'AWBN056835491'
        const crearParcelResponse = await crossBorderRest.postCrearParcel(guiaDuplicada, token)
        expect(crearParcelResponse.status()).toBe(422)
        expect(crearParcelResponse.json()).toMatchObject({
            code: 'way-bill-exists',
            message: `Guía ${guiaDuplicada} ya existe`
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-04: Bearer Vacio', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcel('AWBN056835492')
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})

test('TC-SEGU-API-06: Firma Inválida', async () => {
    try {
        const crearParcelResponse = await crossBorderRest.postCrearParcel('AWBN056835492', tokenType.TokenInvalido)
        expect(crearParcelResponse.status()).toBe(401)
        expect(crearParcelResponse.json()).resolves.toMatchObject({
            message: 'token inválido',
            status: 'FAILED'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Connection error:', error.message)
        } else {
            console.error('Unknown error:', error)
        }
        throw error
    }
})
