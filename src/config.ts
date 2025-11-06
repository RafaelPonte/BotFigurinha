import { pino } from 'pino'
import { isJidBroadcast, AuthenticationState, WAVersion, UserFacingSocketConfig, Browsers } from 'baileys'
import NodeCache from 'node-cache'
import { getMessageFromCache } from './utils/whatsapp.util.js'

export default function configSocket (state : AuthenticationState, retryCache : NodeCache, version: WAVersion, messageCache: NodeCache){
    const config : UserFacingSocketConfig =  {
        auth: state,
        version,
        msgRetryCounterCache : retryCache,
        defaultQueryTimeoutMs: 60000,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        qrTimeout: 60000, // 60 seconds timeout for QR code
        printQRInTerminal: false, // We handle QR display manually
        browser: Browsers.ubuntu('Chrome'),
        logger: pino({level: 'silent'}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid?.endsWith('@newsletter'),
        getMessage: async (key) => {
            const message = (key.id) ? getMessageFromCache(key.id, messageCache) : undefined
            return message
        }
    }

    return config
}