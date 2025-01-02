const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { textToVoice } = require("./services/eventlab");


const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Estamos para ayudarte en nuestra atencion de servicio al cliente',
       'Tenga buen dia y muchos existos en el 2025'
    ],
    null,
    null,
    [flowSecundario]
)




//const flowVentas = addKeyword(["pedir", "ordenar","agua"])
//.addAnswer(
 // ["Claro que te interesa?", "mejor te envio audio.."],
 // null,
 // async (_, { flowDynamic }) => {
 //   console.log("🙉 texto a voz....");
  //  const path = await textToVoice(
  //    "Si claro como te puedo ayudar enviame detalles sobre tu pedido"
  //  );
  //  console.log(`🙉 Fin texto a voz....[PATH]:${path}`);
  //  await flowDynamic([{ body: "escucha", media: path }]);
 // }
//);
const pathFile = `${process.cwd()}/Sonidos/saludos.mp3`;
//nombre,direccion,pedido,forma,numero
let persona = {
    nombre: '',
    direccion: '',
    pedido: '',
    formapago: '',
    numero: ''
};

const flowVentas = addKeyword(["pedir", "ordenar", "agua", 'solicitar', 'enviame', 'pacas'])
    .addAnswer(
        ["Claro que te interesa?", "mejor te envio audio.."],
        { body: "Bienvenido", media: pathFile }
    )
    .addAnswer(
        '¿Cual es tu nombre?',
        { capture: true },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ nombre: ctx.body });
            await flowDynamic('Gracias por tu nombre! 😊');
            console.log('Nombre guardado:', ctx.body);
        }
    )
    .addAnswer(
        '¿Cual es tu Direccion No regala alguna indicacion adicional?',
        { capture: true },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ direccion: ctx.body });
            const myState = await state.getMyState();
            await flowDynamic(`Gracias ${myState.nombre}, dirección registrada! 📍`);
            console.log('Dirección guardada:', ctx.body);
        }
    )
    .addAnswer(
        '¿Detalle Breve De tu Pedido?',
        { capture: true },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ pedido: ctx.body });
            await flowDynamic('Pedido registrado correctamente! 📦');
            console.log('Pedido guardado:', ctx.body);
        }
    )
    .addAnswer(
        '¿Forma de Pago Efectivo, Transferencia O Nequi.?',
        { capture: true },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ 
                formapago: ctx.body,
                numero: ctx.from 
            });
            await flowDynamic('Forma de pago registrada! 💳');
            console.log('Forma de pago guardada:', ctx.body);
        }
    )
    .addAnswer(
        'Resumen de tu pedido:',
        null,
        async (_, { flowDynamic, state }) => {
            const myState = await state.getMyState();
            await flowDynamic(`*RESUMEN DE TU PEDIDO* ✨

🧊 *AGUA ARTIKA* 🧊

-------------------
📋 *Datos del Pedido:*
-------------------

👤 *Nombre:* 
${myState.nombre}

📍 *Dirección:* 
${myState.direccion}

📦 *Pedido:* 
${myState.pedido}

💰 *Forma de pago:* 
${myState.formapago}

📱 *Teléfono:* 
${myState.numero}

-------------------
¡Gracias por tu compra! 🙏
Tu pedido será procesado pronto.

*AGUA ARTIKA* 
_Refresca tu vida_ 💧`);
        }
    );
    const flowPrincipal = addKeyword([
        // Saludos formales
        'hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'buen dia',
        // Saludos informales
        'ole', 'alo', 'hi', 'hey', 'que tal', 'que mas', 'quiubo', 'qiubo', 'kiubo',
        // Variaciones con errores comunes
       // 'ola', 'hols', 'hola!', 'hola buenos dias', 'buenas', 'bn dias',
        // Intención directa
        'agua', 'necesito agua', 'quiero agua', 'botellon', 'botellones', 'artika',
        // Preguntas comunes de inicio
        'estan', 'hay servicio', 'atienden', 'están atendiendo', 'servicio',
        // Información
        'info', 'información', 'informacion', 'precio', 'precios',
        // Urgencia
        'urgente', 'necesito', 'ayuda', 'asistencia'
    ])
        .addAnswer(
            '🙌 Bienvenido hidratarte con ARTIKA ! 😍 Programa ya tu pedido para el día de HOY.',
            null,
            async (ctx) => {
                const mensaje = ctx.body.toLowerCase();
                console.log('Mensaje recibido:', mensaje);
                console.log('Número de WhatsApp:', ctx.from);
                console.log('Palabra clave que activó el flujo:', ctx.keyword);
            }
        )
        .addAnswer(
            [
                'Desea Programar tu Pedido el dia de Hoy',
                'Escribe "Pedir" - Para Programar Pedido',
            ],
            null,
            null
        );

        const handleMessage = (ctx) => {
            console.log('-------- Nuevo Mensaje --------');
            console.log('Mensaje completo:', ctx.body);
            console.log('De:', ctx.from);
            console.log('Timestamp:', new Date().toLocaleString());
            console.log('------------------------------');
        };
        

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowVentas,flowGracias])
    const adapterProvider = createProvider(BaileysProvider)
 
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
