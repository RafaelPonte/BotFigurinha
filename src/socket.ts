
import {makeWASocket, fetchLatestBaileysVersion, WASocket} from 'baileys'
import NodeCache from 'node-cache'
import configSocket from './config.js'
import { BotController } from './controllers/bot.controller.js'
import { connectionClose, connectionOpen, connectionPairingCode, connectionQr } from './events/connection.event.js'
import { messageReceived } from './events/message-received.event.js'
import { addedOnGroup } from './events/group-added.event.js'
import { groupParticipantsUpdated } from './events/group-participants-updated.event.js'
import { partialGroupUpdate } from './events/group-partial-update.event.js'
import { syncGroupsOnStart } from './helpers/groups.sync.helper.js'
import { executeEventQueue, queueEvent } from './helpers/events.queue.helper.js'
import botTexts from './helpers/bot.texts.helper.js'
import { askQuestion, colorText } from './utils/general.util.js'
import { useNeDBAuthState } from './helpers/session.auth.helper.js'

//Cache de tentativa de envios
const retryCache = new NodeCache()
//Cache de eventos na fila até o bot inicializar
const eventsCache = new NodeCache()
//Cache de mensagens para serem reenviadas em caso de falha
const messagesCache = new NodeCache({stdTTL: 5*60, useClones: false})

export default async function connect(){
    const { state, saveCreds } = await useNeDBAuthState()
    const { version } = await fetchLatestBaileysVersion()
    const client : WASocket = makeWASocket(configSocket(state, retryCache, version, messagesCache))
    let connectionType : string | null = null
    let isBotReady = false
    eventsCache.set("events", [])

    //Eventos
    client.ev.process(async(events)=>{
        const botInfo = new BotController().getBot()

        //Status da conexão
        if (events['connection.update']){
            const connectionState = events['connection.update']
            const { connection, qr, receivedPendingNotifications } = connectionState
            let needReconnect = false

            // Handle QR code display
            if (qr) {
                if (!connectionType) {
                    console.log(colorText(botTexts.not_connected, '#e0e031'))
                    connectionType = await askQuestion(botTexts.input_connection_method)

                    if (connectionType == '2') {
                        connectionPairingCode(client)
                    } else {
                        await connectionQr(qr)
                    }
                } else if (connectionType != '2') {
                    console.log(colorText('🔄 Novo QR Code gerado (o anterior expirou)', '#ff9800'))
                    await connectionQr(qr)
                }
            }

            // Handle connection states
            if (connection === 'connecting'){
                console.log(colorText(botTexts.connecting))
            } else if (connection === 'open'){
                // Connection opened successfully
                if (!isBotReady) {
                    console.log(colorText('✅ Connected! Testing in MINIMAL MODE (no operations)...', '#4caf50'))
                    console.log(colorText('⏱️  Waiting 30 seconds to see if connection stays stable...', '#ff9800'))
                    await new Promise(resolve => setTimeout(resolve, 30000))

                    // TEMPORARILY DISABLED ALL OPERATIONS TO TEST IF CONNECTION STAYS
                    // If connection stays stable for 30 seconds, the issue is in these operations:
                    // await connectionOpen(client)
                    // await syncGroupsOnStart(client)
                    // await executeEventQueue(client, eventsCache)

                    isBotReady = true
                    console.log(colorText('✅ CONNECTION STABLE! Bot is connected but NOT initialized', '#4caf50'))
                    console.log(colorText('⚠️  If you see this message, connection works but operations cause disconnect', '#ff9800'))
                }
            } else if (connection === 'close'){
                needReconnect = await connectionClose(connectionState)
            }

            if (needReconnect) connect()
        }

        // Credenciais
        if (events['creds.update']){
            await saveCreds()
        }

        // Receber mensagem
        if (events['messages.upsert']){
            const message = events['messages.upsert']

            if (isBotReady) await messageReceived(client, message, botInfo, messagesCache)
        }

        // Atualização de participantes no grupo
        if (events['group-participants.update']){
            const participantsUpdate = events['group-participants.update']

            if (isBotReady) await groupParticipantsUpdated(client, participantsUpdate, botInfo)
            else queueEvent(eventsCache, "group-participants.update", participantsUpdate)    
        }
        
        // Novo grupo
        if (events['groups.upsert']){
            const groups = events['groups.upsert']

            if (isBotReady) await addedOnGroup(client, groups, botInfo)
            else queueEvent(eventsCache, "groups.upsert", groups)     
        }

        // Atualização parcial de dados do grupo
        if (events['groups.update']){
            const groups = events['groups.update']

            if (groups.length == 1 && groups[0].participants == undefined){
                if (isBotReady) await partialGroupUpdate(groups[0])
                else queueEvent(eventsCache, "groups.update", groups)
            }
        }
    })
}