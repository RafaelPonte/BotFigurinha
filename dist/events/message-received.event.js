import { showConsoleError } from '../utils/general.util.js';
import { UserController } from '../controllers/user.controller.js';
import { handleGroupMessage, handlePrivateMessage } from '../helpers/message.handler.helper.js';
import { GroupController } from '../controllers/group.controller.js';
import { storeMessageOnCache, formatWAMessage } from '../utils/whatsapp.util.js';
import { commandInvoker } from '../helpers/command.invoker.helper.js';
export async function messageReceived(client, messages, botInfo, messageCache) {
    try {
        console.log('[DEBUG MSG] ========== NEW MESSAGE ==========');
        console.log('[DEBUG MSG] Type:', messages.type);
        console.log('[DEBUG MSG] From:', messages.messages[0].key.remoteJid);
        console.log('[DEBUG MSG] FromMe:', messages.messages[0].key.fromMe);
        if (messages.messages[0].key.fromMe) {
            storeMessageOnCache(messages.messages[0], messageCache);
            console.log('[DEBUG MSG] Message from me, SKIPPING');
            return;
        }
        switch (messages.type) {
            case 'notify':
                console.log('[DEBUG MSG] Processing notify message');
                const userController = new UserController();
                const groupController = new GroupController();
                const idChat = messages.messages[0].key.remoteJid;
                const isGroupMsg = idChat?.includes("@g.us");
                console.log('[DEBUG MSG] Is group message:', isGroupMsg);
                console.log('[DEBUG MSG] Chat ID:', idChat);
                const group = (isGroupMsg && idChat) ? await groupController.getGroup(idChat) : null;
                console.log('[DEBUG MSG] Group found in DB:', group ? 'YES' : 'NO');
                // If group not found in database, sync it automatically
                if (isGroupMsg && !group && idChat) {
                    console.log('[DEBUG MSG] Syncing missing group...');
                    try {
                        const groupMetadata = await client.groupMetadata(idChat);
                        await groupController.registerGroup(groupMetadata);
                        console.log('[DEBUG MSG] Group synced successfully');
                    }
                    catch (err) {
                        console.log('[DEBUG MSG] Failed to sync group:', err);
                    }
                }
                let message = await formatWAMessage(messages.messages[0], group, botInfo.host_number);
                console.log('[DEBUG MSG] Message formatted:', message ? 'YES' : 'NO');
                if (message) {
                    console.log('[DEBUG MSG] Sender:', message.sender);
                    console.log('[DEBUG MSG] Command:', message.command);
                    await userController.registerUser(message.sender, message.pushname);
                    if (!isGroupMsg) {
                        console.log('[DEBUG MSG] Handling PRIVATE message');
                        const needCallCommand = await handlePrivateMessage(client, botInfo, message);
                        console.log('[DEBUG MSG] Need call command (private):', needCallCommand);
                        if (needCallCommand) {
                            await commandInvoker(client, botInfo, message, null);
                        }
                    }
                    else if (group) {
                        console.log('[DEBUG MSG] Handling GROUP message');
                        const needCallCommand = await handleGroupMessage(client, group, botInfo, message);
                        console.log('[DEBUG MSG] Need call command (group):', needCallCommand);
                        if (needCallCommand) {
                            console.log('[DEBUG MSG] Calling commandInvoker');
                            await commandInvoker(client, botInfo, message, group);
                        }
                    }
                    else {
                        console.log('[DEBUG MSG] Group message but NO GROUP in DB - SKIPPING');
                    }
                }
                break;
        }
    }
    catch (err) {
        showConsoleError(err, "MESSAGES.UPSERT");
    }
}
