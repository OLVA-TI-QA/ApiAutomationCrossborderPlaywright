import { expect, test } from '@playwright/test';
import { CrossBorderRest } from '@/apiProviders/crossborderRest';

let crossBorderRest: CrossBorderRest;

// Setup de baseURL before all test
// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})


test('TC-AUTH-001: Obtener token', async () => {
    const getResponse = await crossBorderRest.getToken('MTE5NjM2ODppQlMweTIzeGhHbWxTcWxWZHVxbnpMUFRndTlvc1M5c1c2NGVNaklGSG1v')

    expect(getResponse.status()).toBe(200);
    console.log(getResponse.json())
})
// test('Buscar auditoria con json', async () => {
//     const getResponse = await baseUrl.get('/api/v1/guia-despacho/auditoria', {
//         params: {
//             tipoGeneracion: fileData.tipoGeneracion,
//             idGuiaDespachos: fileData.idGuiaDespachos,
//         }
//     });
//     expect(getResponse.status()).toBe(200);
//     console.log(await getResponse.json());
// })
