import { makeWASocket } from 'baileys';
import NodeCache from 'node-cache';
import configSocket from './config.js';
import { BotController } from './controllers/bot.controller.js';
import { connectionClose, connectionOpen, connectionPairingCode, connectionQr } from './events/connection.event.js';
import { messageReceived } from './events/message-received.event.js';
import { addedOnGroup } from './events/group-added.event.js';
import { groupParticipantsUpdated } from './events/group-participants-updated.event.js';
import { partialGroupUpdate } from './events/group-partial-update.event.js';
import { executeEventQueue, queueEvent } from './helpers/events.queue.helper.js';
import botTexts from './helpers/bot.texts.helper.js';
import { askQuestion, colorText } from './utils/general.util.js';
import { useNeDBAuthState } from './helpers/session.auth.helper.js';
//Cache de tentativa de envios
const retryCache = new NodeCache();
//Cache de eventos na fila até o bot inicializar
const eventsCache = new NodeCache();
//Cache de mensagens para serem reenviadas em caso de falha
const messagesCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
export default async function connect() {
    const { state, saveCreds } = await useNeDBAuthState();
    // Use a known stable version that works reliably (tested and approved)
    const version = [2, 2412, 54];
    console.log(colorText(`🔧 Using stable WhatsApp Web version: ${version.join('.')}`, '#2196f3'));
    const client = makeWASocket(configSocket(state, retryCache, version, messagesCache));
    let connectionType = null;
    let isBotReady = false;
    eventsCache.set("events", []);
    //Eventos
    client.ev.process(async (events) => {
        const botInfo = new BotController().getBot();
        //Status da conexão
        if (events['connection.update']) {
            const connectionState = events['connection.update'];
            const { connection, qr, receivedPendingNotifications } = connectionState;
            let needReconnect = false;
            // Handle QR code display
            if (qr) {
                if (!connectionType) {
                    console.log(colorText(botTexts.not_connected, '#e0e031'));
                    connectionType = await askQuestion(botTexts.input_connection_method);
                    if (connectionType == '2') {
                        connectionPairingCode(client);
                    }
                    else {
                        await connectionQr(qr);
                    }
                }
                else if (connectionType != '2') {
                    console.log(colorText('🔄 Novo QR Code gerado (o anterior expirou)', '#ff9800'));
                    await connectionQr(qr);
                }
            }
            // Handle connection states
            if (connection === 'connecting') {
                console.log(colorText(botTexts.connecting));
            }
            else if (connection === 'open') {
                // Connection opened successfully
                if (!isBotReady) {
                    console.log(colorText('✅ Connected! Waiting 20 seconds to ensure stability...', '#4caf50'));
                    // Wait very long to ensure connection is fully stable
                    await new Promise(resolve => setTimeout(resolve, 20000));
                    console.log(colorText('🔄 Minimal bot initialization (NO group sync)...', '#2196f3'));
                    await connectionOpen(client);
                    // DISABLED: Group sync causes too many requests and triggers 401
                    // await syncGroupsOnStart(client)
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    isBotReady = true;
                    await executeEventQueue(client, eventsCache);
                    console.log(colorText('✅ Bot connected in SAFE MODE - Group sync disabled to prevent 401', '#4caf50'));
                    console.log(colorText('📝 Groups will sync naturally as messages arrive', '#2196f3'));
                }
            }
            else if (connection === 'close') {
                needReconnect = await connectionClose(connectionState);
            }
            if (needReconnect)
                connect();
        }
        // Credenciais
        if (events['creds.update']) {
            await saveCreds();
        }
        // Receber mensagem
        if (events['messages.upsert']) {
            const message = events['messages.upsert'];
            if (isBotReady)
                await messageReceived(client, message, botInfo, messagesCache);
        }
        // Atualização de participantes no grupo
        if (events['group-participants.update']) {
            const participantsUpdate = events['group-participants.update'];
            if (isBotReady)
                await groupParticipantsUpdated(client, participantsUpdate, botInfo);
            else
                queueEvent(eventsCache, "group-participants.update", participantsUpdate);
        }
        // Novo grupo
        if (events['groups.upsert']) {
            const groups = events['groups.upsert'];
            if (isBotReady)
                await addedOnGroup(client, groups, botInfo);
            else
                queueEvent(eventsCache, "groups.upsert", groups);
        }
        // Atualização parcial de dados do grupo
        if (events['groups.update']) {
            const groups = events['groups.update'];
            if (groups.length == 1 && groups[0].participants == undefined) {
                if (isBotReady)
                    await partialGroupUpdate(groups[0]);
                else
                    queueEvent(eventsCache, "groups.update", groups);
            }
        }
    });
}
