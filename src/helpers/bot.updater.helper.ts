import * as updaterUtil from "../utils/updater.util.js";
import { colorText, getCurrentBotVersion } from "../utils/general.util.js";
import botTexts from "../helpers/bot.texts.helper.js";
import { BotController } from "../controllers/bot.controller.js";
import databaseMigration from "./database.migrate.helper.js";

export async function botUpdater(){
    const botController = new BotController()
    const botInfo = botController.getBot()
    let hasBotUpdated = false

    try{
        if (!botInfo.db_migrated || process.env.migrate) {
            await databaseMigration()
            botController.setDbMigrated(true)
            console.log(colorText(botTexts.migrating_database, '#e0e031'))
        }

        console.log(colorText('🔍 Checking for updates from GitHub...', '#2196f3'))
        const currentVersion = getCurrentBotVersion()
        const checkUpdate = await updaterUtil.checkUpdate(currentVersion)

        if (checkUpdate.latest) {
            console.log(colorText('✅ Bot is up to date! No updates available.', '#4caf50'))
        } else {
            console.log(colorText(`📦 New update available! (${checkUpdate.commitsAhead} commits ahead)`, '#e0e031'))
            console.log(colorText('🚀 Starting auto-update process...', '#2196f3'))

            await updaterUtil.makeUpdate()

            console.log(colorText('🔄 Restarting bot to apply updates...', '#e0e031'))
            hasBotUpdated = true

            // Exit process to allow process manager to restart
            setTimeout(() => {
                process.exit(0)
            }, 2000)
        }

        return hasBotUpdated
    } catch(err){
        console.log("[botUpdater]", colorText(botTexts.error_check_update, "#d63e3e"))
        console.error(err)
        return hasBotUpdated
    }
}