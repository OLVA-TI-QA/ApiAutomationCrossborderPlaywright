import { expect, test } from '@playwright/test';
import { CrossBorderRest } from '@/apiProviders/crossborderRest';

let crossBorderRest: CrossBorderRest;

// Setup de baseURL before all test
// Setup de provider before all test
test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
})


test('Buscar auditoria', async () => {
    const getResponse = await crossBorderRest.getToken('MTk2MzY4OmlCUzB5MjN4aEdtbFNxbFZkdXFuekxQVGd1OW9zUzlzVzY0ZU1qSUZIbW8=')

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
