import { test, expect } from '@playwright/test'
import { procesarValorCeldaExcel, validarDatosExcel } from '@/utils/validadores'
import { exportarResultadosGenerico, leerDatosDesdeExcel } from '@/utils/helpers'
import { ExcelValidacionExportParcelDeclare, ParcelDeclareRequestBody, tokenType } from '@/types/Interfaces'
import { CrossBorderRest } from '@/apiProviders/crossborderRest'

test.describe('Pruebas de la API de Parcel Declare con Excel', () => {
  let crossBorderRest: CrossBorderRest

  // Ruta y nombre de la hoja de Excel
  const excelPath = './src/testData/archivosExcel/ParcelDeclareRequest_v2.xlsx'
  const sheetName = 'BodyRequest'

  // Define el tamaño de cada lote de peticiones
  const BATCH_SIZE = 15

  // Setup de provider before all test
  test.beforeEach(async () => {
    const currentEnvioRest = new CrossBorderRest()
    crossBorderRest = await currentEnvioRest.init()
  })

  // Test principal con múltiples envíos
  test('Enviar peticiones con valores no válidos y validar respuestas correctas', async () => {
    // Aumenta el tiempo de espera a 120 segundos (120000ms)
    test.setTimeout(120000)

    // Paso 1: Leer Excel
    const datos = leerDatosDesdeExcel(excelPath, sheetName)
    // Validar que el archivo de datos existe y tiene datos
    validarDatosExcel(datos, sheetName)

    const resultadosValidacion: ExcelValidacionExportParcelDeclare[] = []

    // Medir tiempo de respuesta del token
    const tiempoInicioToken = performance.now()
    const getTokenResponse = await crossBorderRest.postToken(tokenType.Eduardo)
    const tiempoFinToken = performance.now()
    const tiempoRespuestaTokenMs = tiempoFinToken - tiempoInicioToken
    const tiempoRespuestaToken = tiempoRespuestaTokenMs / 1000 // Convertir a segundos
    console.log(`⏱️  Tiempo de respuesta del token: ${tiempoRespuestaToken.toFixed(3)}s (${tiempoRespuestaTokenMs.toFixed(2)}ms)`)

    expect(getTokenResponse.status()).toBe(200)
    expect(getTokenResponse.json()).resolves.toMatchObject({
      access_token: expect.any(String),
      token_type: 'Bearer'
    })
    console.log(getTokenResponse.json())

    const authBody = await getTokenResponse.json()
    const token = authBody.access_token
    expect(token).toBeDefined()
    console.log(`🔐 Token obtenido: ${token}`)

    // 2. Iterar los datos en lotes para procesar peticiones con concurrencia limitada
    for (let i = 0; i < datos.length; i += BATCH_SIZE) {
      const batch = datos.slice(i, i + BATCH_SIZE)
      console.log(
        `\n--- Procesando lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(datos.length / BATCH_SIZE)} (${batch.length} elementos) ---`
      )

      // 2. Mapear los datos a un array de promesas de peticiones API
      const requestsToSendForBatch = batch.map(async (fila: any) => {
        // Ajusta los nombres de las columnas a como estén en tu Excel
        const idTestCase = fila['idTestCase']
        const fromCountry = procesarValorCeldaExcel(fila['fromCountry'])
        const logisticsCode = procesarValorCeldaExcel(fila['logisticsCode'])
        const currency = procesarValorCeldaExcel(fila['currency'])
        const grossWeight = procesarValorCeldaExcel(fila['grossWeight'])
        const packageCount = procesarValorCeldaExcel(fila['packageCount'])
        const purchaseWebsite = procesarValorCeldaExcel(fila['purchaseWebsite'])
        const valueAddedTax = procesarValorCeldaExcel(fila['valueAddedTax'])
        const shipping = procesarValorCeldaExcel(fila['shipping'])
        const ctnNumber = procesarValorCeldaExcel(fila['ctnNumber'])
        const invoiceNumber = procesarValorCeldaExcel(fila['invoiceNumber'])
        const wayBillNo = procesarValorCeldaExcel(fila['wayBillNo'])
        const insurance = procesarValorCeldaExcel(fila['insurance'])
        const receiverInfoAddress = procesarValorCeldaExcel(fila['receiverInfo-address'])
        const receiverInfoEmail = procesarValorCeldaExcel(fila['receiverInfo-email'])
        const receiverInfoFullName = procesarValorCeldaExcel(fila['receiverInfo-fullName'])
        const receiverInfoMobilePhone = procesarValorCeldaExcel(fila['receiverInfo-mobilePhone'])
        const receiverInfoubigeoCode = procesarValorCeldaExcel(fila['receiverInfo-ubigeoCode'])
        const receiverInfoProvince = procesarValorCeldaExcel(fila['receiverInfo-province'])
        const receiverInfoDistrict = procesarValorCeldaExcel(fila['receiverInfo-district'])
        const receiverInfoZipCode = procesarValorCeldaExcel(fila['receiverInfo-zipCode'])
        const receiverInfoIdentityNumber = procesarValorCeldaExcel(fila['receiverInfo-identityNumber'])
        const receiverInfoIdentityNumberType = procesarValorCeldaExcel(fila['receiverInfo-identityNumberType'])
        const senderInfoAddress = procesarValorCeldaExcel(fila['senderInfo-address'])
        const senderInfoEmail = procesarValorCeldaExcel(fila['senderInfo-email'])
        const senderInfoFullName = procesarValorCeldaExcel(fila['senderInfo-fullName'])
        const senderInfoMobilePhone = procesarValorCeldaExcel(fila['senderInfo-mobilePhone'])
        const senderInfoubigeoCode = procesarValorCeldaExcel(fila['senderInfo-ubigeoCode'])
        const senderInfoProvince = procesarValorCeldaExcel(fila['senderInfo-province'])
        const senderInfoDistrict = procesarValorCeldaExcel(fila['senderInfo-district'])
        const senderInfoZipCode = procesarValorCeldaExcel(fila['senderInfo-zipCode'])
        const senderInfoIdentityNumber = procesarValorCeldaExcel(fila['senderInfo-identityNumber'])
        const senderInfoIdentityNumberType = procesarValorCeldaExcel(fila['senderInfo-identityNumberType'])
        const returnInfoAddress = procesarValorCeldaExcel(fila['returnInfo-address'])
        const returnInfoEmail = procesarValorCeldaExcel(fila['sreturnnfo-email'])
        const returnInfoFullName = procesarValorCeldaExcel(fila['returnInfo-fullName'])
        const returnInfoMobilePhone = procesarValorCeldaExcel(fila['returnInfo-mobilePhone'])
        const returnInfoubigeoCode = procesarValorCeldaExcel(fila['returnInfo-ubigeoCode'])
        const returnInfoProvince = procesarValorCeldaExcel(fila['returnInfo-province'])
        const returnInfoDistrict = procesarValorCeldaExcel(fila['returnInfo-district'])
        const returnInfoZipCode = procesarValorCeldaExcel(fila['returnInfo-zipCode'])
        const returnInfoIdentityNumber = procesarValorCeldaExcel(fila['returnInfo-identityNumber'])
        const returnInfoIdentityNumberType = procesarValorCeldaExcel(fila['returnInfo-identityNumberType'])
        const itemListUnoCurrency = procesarValorCeldaExcel(fila['itemList-uno-currency'])
        const itemListUnoItemSequenceNumber = procesarValorCeldaExcel(fila['itemList-uno-itemSequenceNumber'])
        const itemListUnoDescriptionGoods = procesarValorCeldaExcel(fila['itemList-uno-descriptionGoods'])
        const itemListUnoPrice = procesarValorCeldaExcel(fila['itemList-uno-price'])
        const itemListUnoQty = procesarValorCeldaExcel(fila['itemList-uno-qty'])
        const itemListUnoGrossWeight = procesarValorCeldaExcel(fila['itemList-uno-grossWeight'])
        const itemListUnoBrand = procesarValorCeldaExcel(fila['itemList-uno-brand'])
        const itemListUnoModel = procesarValorCeldaExcel(fila['itemList-uno-model'])
        const itemListUnoProductUrl = procesarValorCeldaExcel(fila['itemList-uno-productUrl'])
        const itemListUnoCountryManufacture = procesarValorCeldaExcel(fila['itemList-uno-countryManufacture'])
        const itemListUnoGoodsCondition = procesarValorCeldaExcel(fila['itemList-uno-goodsCondition'])
        const itemListDosCurrency = procesarValorCeldaExcel(fila['itemList-dos-currency'])
        const itemListDosItemSequenceNumber = procesarValorCeldaExcel(fila['itemList-dos-itemSequenceNumber'])
        const itemListDosDescriptionGoods = procesarValorCeldaExcel(fila['itemList-dos-descriptionGoods'])
        const itemListDosPrice = procesarValorCeldaExcel(fila['itemList-dos-price'])
        const itemListDosQty = procesarValorCeldaExcel(fila['itemList-dos-qty'])
        const itemListDosGrossWeight = procesarValorCeldaExcel(fila['itemList-dos-grossWeight'])
        const itemListDosBrand = procesarValorCeldaExcel(fila['itemList-dos-brand'])
        const itemListDosModel = procesarValorCeldaExcel(fila['itemList-dos-model'])
        const itemListDosProductUrl = procesarValorCeldaExcel(fila['itemList-dos-productUrl'])
        const itemListDosCountryManufacture = procesarValorCeldaExcel(fila['itemList-dos-countryManufacture'])
        const itemListDosGoodsCondition = procesarValorCeldaExcel(fila['itemList-dos-goodsCondition'])
        const statusEsperado = fila['status']
        const bodyResponseEsperado = fila['bodyResponse']

        const body: ParcelDeclareRequestBody = {
          fromCountry,
          logisticsCode,
          currency,
          grossWeight,
          packageCount,
          purchaseWebsite,
          valueAddedTax,
          shipping,
          ctnNumber,
          invoiceNumber,
          wayBillNo,
          insurance,
          receiverInfo: {
            address: receiverInfoAddress,
            email: receiverInfoEmail,
            fullName: receiverInfoFullName,
            mobilePhone: receiverInfoMobilePhone,
            ubigeoCode: receiverInfoubigeoCode,
            province: receiverInfoProvince,
            district: receiverInfoDistrict,
            zipCode: receiverInfoZipCode,
            identityNumber: receiverInfoIdentityNumber,
            identityNumberType: receiverInfoIdentityNumberType
          },
          senderInfo: {
            address: senderInfoAddress,
            email: senderInfoEmail,
            fullName: senderInfoFullName,
            mobilePhone: senderInfoMobilePhone,
            ubigeoCode: senderInfoubigeoCode,
            province: senderInfoProvince,
            district: senderInfoDistrict,
            zipCode: senderInfoZipCode,
            identityNumber: senderInfoIdentityNumber,
            identityNumberType: senderInfoIdentityNumberType
          },
          returnInfo: {
            address: returnInfoAddress,
            email: returnInfoEmail,
            fullName: returnInfoFullName,
            mobilePhone: returnInfoMobilePhone,
            ubigeoCode: returnInfoubigeoCode,
            province: returnInfoProvince,
            district: returnInfoDistrict,
            zipCode: returnInfoZipCode,
            identityNumber: returnInfoIdentityNumber,
            identityNumberType: returnInfoIdentityNumberType
          },
          itemList: [
            {
              currency: itemListUnoCurrency,
              itemSequenceNumber: itemListUnoItemSequenceNumber,
              descriptionGoods: itemListUnoDescriptionGoods,
              price: itemListUnoPrice,
              qty: itemListUnoQty,
              grossWeight: itemListUnoGrossWeight,
              brand: itemListUnoBrand,
              model: itemListUnoModel,
              productUrl: itemListUnoProductUrl,
              countryManufacture: itemListUnoCountryManufacture,
              goodsCondition: itemListUnoGoodsCondition
            },
            {
              currency: itemListDosCurrency,
              itemSequenceNumber: itemListDosItemSequenceNumber,
              descriptionGoods: itemListDosDescriptionGoods,
              price: itemListDosPrice,
              qty: itemListDosQty,
              grossWeight: itemListDosGrossWeight,
              brand: itemListDosBrand,
              model: itemListDosModel,
              productUrl: itemListDosProductUrl,
              countryManufacture: itemListDosCountryManufacture,
              goodsCondition: itemListDosGoodsCondition
            }
          ]
        }

        console.log(`Preparando solicitud para testcase: ${idTestCase}`)

        // Medir tiempo de respuesta del parcel
        const tiempoInicioParcel = performance.now()
        const response = await crossBorderRest.postCrearParcelMasivo(token, body)
        const tiempoFinParcel = performance.now()
        const tiempoRespuestaParcelMs = tiempoFinParcel - tiempoInicioParcel
        const tiempoRespuestaParcel = tiempoRespuestaParcelMs / 1000 // Convertir a segundos

        // Retornamos la respuesta y algunos datos adicionales para la validación
        // return { response, idTestCase, statusEsperado, bodyResponseEsperado, wayBillNo, tiempoRespuestaParcel }
        return { response, idTestCase, statusEsperado, bodyResponseEsperado, tiempoRespuestaParcel }
      })

      // Ejecutar todas las promesas del lote en paralelo y esperar a que terminen
      const responsesInBatch = await Promise.all(requestsToSendForBatch)

      // 3. Procesar y validar cada respuesta del lote
      // for (const { response, idTestCase, statusEsperado, bodyResponseEsperado, wayBillNo, tiempoRespuestaParcel } of responsesInBatch) {
      for (const { response, idTestCase, statusEsperado, bodyResponseEsperado, tiempoRespuestaParcel } of responsesInBatch) {
        const bodyResponse = await response.json()

        console.log(`Response for testcase ${idTestCase}:`, bodyResponse)

        // Función para normalizar el orden de arrays y objetos para comparación
        const normalizeForComparison = (obj: any): string => {
          if (Array.isArray(obj)) {
            // Ordenar arrays por field primero, luego por message
            const sorted = obj.sort((a, b) => {
              // Si ambos tienen field, ordenar por field primero
              if (a.field && b.field) {
                const fieldComparison = a.field.localeCompare(b.field)
                if (fieldComparison !== 0) {
                  return fieldComparison
                }
              }
              // Si field es igual o no existe, ordenar por message
              if (a.message && b.message) {
                return a.message.localeCompare(b.message)
              }
              // Fallback: comparar por representación JSON completa
              return JSON.stringify(a).localeCompare(JSON.stringify(b))
            })
            return JSON.stringify(sorted)
          } else if (typeof obj === 'object' && obj !== null) {
            // Para objetos, ordenar las claves
            const sortedObj = Object.keys(obj)
              .sort()
              .reduce((result: any, key) => {
                result[key] = obj[key]
                return result
              }, {})
            return JSON.stringify(sortedObj)
          }
          return JSON.stringify(obj)
        }

        // La lógica de validación ahora es más explícita y segura
        let statusCorrecto: boolean
        let bodyResponseEsperadoCorrecto: boolean
        let trackingUrlCorrecto: boolean
        let mensajeErrorObtenido: string = ''
        let wayBillNoObtenido: string = ''
        let trackingUrl: string = ''

        const statusObtenido = response.status()

        if (statusObtenido === statusEsperado) {
          statusCorrecto = true
          //Uso de switch case para la conversión
          switch (statusObtenido) {
            case 201:
              mensajeErrorObtenido = bodyResponse.message
              // wayBillNoObtenido = wayBillNo ?? 'No se creo Parcel'
              wayBillNoObtenido = bodyResponse.wayBillNo ?? 'No se creo Parcel'
              trackingUrl = bodyResponse.trackingUrl ?? 'No se creo Parcel'

              // 1. Extraer la emisión (los 2 primeros dígitos) y el remito (el resto)
              // const emision = wayBillNoObtenido.substring(0, 2); // '25'
              // const remito = wayBillNoObtenido.substring(2);     // '41263813'

              // 2. Construir la ruta URL esperada usando las partes extraídas
              const rutaEsperada = `https://tracking.olvaexpress.pe/?tipo=byExternal&codigo=47190376&numero=${wayBillNoObtenido}`

              // 3. Validar si la URL proporcionada coincide con la URL esperada
              trackingUrlCorrecto = trackingUrl === rutaEsperada

              if (trackingUrlCorrecto) {
                bodyResponseEsperadoCorrecto = true
              } else {
                bodyResponseEsperadoCorrecto = false
              }

              break
            default:
              if (normalizeForComparison(bodyResponse) === normalizeForComparison(JSON.parse(bodyResponseEsperado))) {
                bodyResponseEsperadoCorrecto = true
              } else {
                bodyResponseEsperadoCorrecto = false
              }

              mensajeErrorObtenido = bodyResponse.message
              wayBillNoObtenido = 'No se creo Parcel'
              trackingUrl = 'No se creo Parcel'
              break
          }
        } else {
          // Si el status no es 200, asumimos que hay un error
          statusCorrecto = false
          bodyResponseEsperadoCorrecto = false
          mensajeErrorObtenido = bodyResponse.message
          wayBillNoObtenido = bodyResponse.wayBillNo ?? 'No se creo Parcel'
          trackingUrl = bodyResponse.trackingUrl ?? 'No se creo Parcel'

          if (trackingUrl !== 'No se creo Parcel') {
            // 1. Extraer la emisión (los 2 primeros dígitos) y el remito (el resto)
            const emision = wayBillNoObtenido.substring(0, 2) // '25'
            const remito = wayBillNoObtenido.substring(2) // '41263813'

            // 2. Construir la ruta URL esperada usando las partes extraídas
            const rutaEsperada = `https://tracking.olvaexpress.pe?emision=${emision}&remito=${remito}`

            // 3. Validar si la URL proporcionada coincide con la URL esperada
            trackingUrlCorrecto = trackingUrl === rutaEsperada
          } else {
            trackingUrlCorrecto = false
          }

          console.log(`Error obtenido para la fila con ID Test Case ${idTestCase}: ${statusObtenido} - ${mensajeErrorObtenido}`)
        }

        resultadosValidacion.push({
          idTestCase: idTestCase,
          statusEsperado: statusEsperado,
          statusObtenido: statusObtenido,
          statusCorrecto: statusCorrecto,
          bodyResponseEsperado: bodyResponseEsperado,
          bodyResponseObtenido: JSON.stringify(bodyResponse),
          bodyResponseEsperadoCorrecto: bodyResponseEsperadoCorrecto,
          mensajeErrorObtenido: mensajeErrorObtenido,
          wayBillNo: wayBillNoObtenido,
          trackingUrl: trackingUrl,
          tiempoRespuestaToken: tiempoRespuestaToken,
          tiempoRespuestaParcel: tiempoRespuestaParcel
        })

        console.log(
          `✅ Fila procesada: ID testcase ${idTestCase} - Status Correcto?: ${statusCorrecto} - Body Response Correcto?: ${bodyResponseEsperadoCorrecto} - Tiempo Token: ${tiempoRespuestaToken.toFixed(3)}s - Tiempo Parcel: ${tiempoRespuestaParcel.toFixed(3)}s`
        )
      }
    } // Fin del bucle de lotes

    // 4. Generar el resumen y exportar a Excel
    const totalRegistros = resultadosValidacion.length
    const bodyResponseEsperadoCorrecto = resultadosValidacion.filter((item) => item.bodyResponseEsperadoCorrecto === true).length
    const bodyResponseEsperadoInCorrecto = totalRegistros - bodyResponseEsperadoCorrecto
    const status400Obtenidos = resultadosValidacion.filter((item) => item.statusObtenido === 400).length
    const status201Obtenidos = totalRegistros - status400Obtenidos
    const status400Esperados = resultadosValidacion.filter((item) => item.statusEsperado === 400).length
    const status201Esperados = totalRegistros - status400Esperados

    console.log('---')
    console.log(`📊 Resumen de la prueba:`)
    console.log(`- ${totalRegistros} registros procesados.`)
    console.log(`- ${bodyResponseEsperadoInCorrecto} body response con error (error: false).`)
    console.log(`- ${status400Obtenidos} status 400 obtenidos.`)
    console.log(`- ${status201Obtenidos} status 201 obtenidos.`)
    console.log('---')

    exportarResultadosGenerico<ExcelValidacionExportParcelDeclare>({
      data: resultadosValidacion,
      nombreBase: 'resultados_validacion_estructura_body_request_parcel',
      headers: [
        'ID TESTCASE',
        'STATUS ESPERADO',
        'STATUS OBTENIDO',
        'EL STATUS ES CORRECTO?',
        'BODY RESPONSE ESPERADO',
        'BODY RESPONSE OBTENIDO',
        'EL BODY RESPONSE ES CORRECTO?',
        'MENSAJE OBTENIDO',
        'PARCEL CREADO',
        'TRACKING URL',
        'TIEMPO RESPUESTA TOKEN (s)',
        'TIEMPO RESPUESTA PARCEL (s)'
      ],
      extraerCampos: [
        (r) => r.idTestCase,
        (r) => r.statusEsperado,
        (r) => r.statusObtenido,
        (r) => (r.statusCorrecto ? 'Sí' : 'No'),
        (r) => r.bodyResponseEsperado,
        (r) => r.bodyResponseObtenido,
        (r) => (r.bodyResponseEsperadoCorrecto ? 'Sí' : 'No'),
        (r) => r.mensajeErrorObtenido,
        (r) => r.wayBillNo,
        (r) => r.trackingUrl,
        (r) => r.tiempoRespuestaToken ?? 0,
        (r) => r.tiempoRespuestaParcel ?? 0
      ]
    })

    // expect(totalRegistros).toBe(bodyResponseEsperadoCorrecto) // Validación de la cantidad de request enviados comparados entre su body response
    expect(status400Obtenidos).toBe(status400Esperados) // Validación de la cantidad de status 400 comparados entre los esperados y obtenidos
    expect(status201Obtenidos).toBe(status201Esperados) // Validación de la cantidad de status 201 comparados entre los esperados y obtenidos
    expect(totalRegistros).toBe(bodyResponseEsperadoCorrecto) // Validación de la cantidad de status 422 comparados entre los esperados y obtenidos
  })
})
