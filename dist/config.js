import { pino } from 'pino';
import { isJidBroadcast, Browsers } from 'baileys';
import { getMessageFromCache } from './utils/whatsapp.util.js';
export default function configSocket(state, retryCache, version, messageCache) {
    const config = {
        auth: state,
        version,
        msgRetryCounterCache: retryCache,
        defaultQueryTimeoutMs: 60000,
        syncFullHistory: false,
        markOnlineOnConnect: false, // Disabled - prevents immediate logout
        qrTimeout: 60000, // 60 seconds timeout for QR code
        printQRInTerminal: false, // We handle QR display manually
        browser: Browsers.windows('Edge'), // Windows Edge - same as working project
        logger: pino({ level: 'silent' }),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid?.endsWith('@newsletter'),
        getMessage: async (key) => {
            const message = (key.id) ? getMessageFromCache(key.id, messageCache) : undefined;
            return message;
        },
        retryRequestDelayMs: 500,
        maxMsgRetryCount: 5,
    };
    return config;
}
