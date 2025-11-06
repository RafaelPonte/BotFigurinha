import { showConsoleError } from '../utils/general.util.js';
import { UserController } from '../controllers/user.controller.js';
import { handleGroupMessage, handlePrivateMessage } from '../helpers/message.handler.helper.js';
import { GroupController } from '../controllers/group.controller.js';
import { storeMessageOnCache, formatWAMessage } from '../utils/whatsapp.util.js';
import { commandInvoker } from '../helpers/command.invoker.helper.js';
export async function messageReceived(client, messages, botInfo, messageCache) {
    try {
        if (messages.messages[0].key.fromMe) {
            storeMessageOnCache(messages.messages[0], messageCache);
        }
        switch (messages.type) {
            case 'notify':
                const userController = new UserController();
                const groupController = new GroupController();
                const idChat = messages.messages[0].key.remoteJid;
                const isGroupMsg = idChat?.includes("@g.us");
                const group = (isGroupMsg && idChat) ? await groupController.getGroup(idChat) : null;
                // DEBUG: Log group status
                if (isGroupMsg) {
                    console.log(`[DEBUG] Group message from: ${idChat}`);
                    console.log(`[DEBUG] Group in database: ${group ? 'YES' : 'NO'}`);
                    if (!group) {
                        console.log(`[DEBUG] Group NOT FOUND in database! Syncing now...`);
                        // Try to sync this specific group
                        try {
                            const groupMetadata = await client.groupMetadata(idChat);
                            await groupController.registerGroup(groupMetadata);
                            console.log(`[DEBUG] Group synced: ${groupMetadata.subject}`);
                        }
                        catch (err) {
                            console.log(`[DEBUG] Failed to sync group:`, err);
                        }
                    }
                }
                let message = await formatWAMessage(messages.messages[0], group, botInfo.host_number);
                console.log(`[DEBUG] Message formatted: ${message ? 'YES' : 'NO'}`);
                if (message) {
                    console.log(`[DEBUG] Registering user: ${message.sender}`);
                    await userController.registerUser(message.sender, message.pushname);
                    if (!isGroupMsg) {
                        console.log(`[DEBUG] Handling PRIVATE message`);
                        const needCallCommand = await handlePrivateMessage(client, botInfo, message);
                        console.log(`[DEBUG] Need call command (private): ${needCallCommand}`);
                        if (needCallCommand) {
                            await commandInvoker(client, botInfo, message, null);
                        }
                    }
                    else if (group) {
                        console.log(`[DEBUG] Handling GROUP message`);
                        const needCallCommand = await handleGroupMessage(client, group, botInfo, message);
                        console.log(`[DEBUG] Need call command (group): ${needCallCommand}`);
                        if (needCallCommand) {
                            console.log(`[DEBUG] Calling commandInvoker for group`);
                            await commandInvoker(client, botInfo, message, group);
                        }
                    }
                }
                break;
        }
    }
    catch (err) {
        showConsoleError(err, "MESSAGES.UPSERT");
    }
}
