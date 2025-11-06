import {DisconnectReason, ConnectionState, WASocket} from 'baileys'
import { Boom } from '@hapi/boom'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, colorText, askQuestion } from '../utils/general.util.js'
import botTexts from '../helpers/bot.texts.helper.js'
import { UserController } from '../controllers/user.controller.js'
import { getHostNumber } from '../utils/whatsapp.util.js'
import qrcode from 'qrcode-terminal'
import { cleanCreds } from '../helpers/session.auth.helper.js'

export async function connectionQr(qr: string){
    if (qr) {
        console.clear() // Clear terminal for better QR visibility
        console.log(colorText('\n📱 CONEXÃO VIA QR CODE\n', '#2196f3'))
        console.log(colorText('Siga os passos abaixo para conectar:\n', '#fff'))
        console.log(colorText('1️⃣  Abra o WhatsApp no seu celular', '#4caf50'))
        console.log(colorText('2️⃣  Toque em Menu (⋮) > Aparelhos conectados', '#4caf50'))
        console.log(colorText('3️⃣  Toque em "Conectar um aparelho"', '#4caf50'))
        console.log(colorText('4️⃣  Aponte seu celular para este QR code\n', '#4caf50'))
        console.log(colorText('⏱️  Você tem 60 segundos para escanear o QR code\n', '#ff9800'))

        await new Promise<void>(resolve => {
            qrcode.generate(qr, {small: true}, (qrcode) => {
                console.log(qrcode)
                console.log(colorText('\n⚠️  IMPORTANTE: Certifique-se de que seu celular está conectado à internet!\n', '#ff9800'))
                resolve()
            })
        })
    }
}

export async function connectionPairingCode(client: WASocket){
    const answerNumber = await askQuestion(botTexts.input_phone_number)
    const code = await client.requestPairingCode(answerNumber.replace(/\W+/g,""))
    console.log(colorText(buildText(botTexts.show_pairing_code, code)))
}

export async function connectionOpen(client: WASocket){
    try{
        const botController = new BotController()
        botController.startBot(getHostNumber(client))
        console.log(colorText(botTexts.bot_data))
        await checkOwnerRegister()
    } catch(err: any) {
        showConsoleError(err, "CONNECTION")
        client.end(new Error("fatal_error"))
    }
}

export async function connectionClose(connectionState : Partial<ConnectionState>){
    try{
        const { lastDisconnect } = connectionState
        let needReconnect = false
        const errorCode = (new Boom(lastDisconnect?.error)).output.statusCode

        if (lastDisconnect?.error?.message == "admin_command"){
            showConsoleError(new Error(botTexts.disconnected.command), 'CONNECTION')
        } else if (lastDisconnect?.error?.message == "fatal_error"){
            showConsoleError(new Error(botTexts.disconnected.fatal_error), 'CONNECTION')
        } else {
            if (errorCode == DisconnectReason?.loggedOut){
                console.log(colorText('\n⚠️  SESSÃO DESLOGADA PELO WHATSAPP', '#ff5722'))
                console.log(colorText('Limpando sessão antiga...', '#ff9800'))
                await cleanCreds()
                console.log(colorText('✅ Sessão limpa! Aguarde 5 segundos antes de reconectar...\n', '#4caf50'))
                await new Promise(resolve => setTimeout(resolve, 5000))
                needReconnect = true
                showConsoleError(new Error(botTexts.disconnected.logout), 'CONNECTION')
            } else if (errorCode == 405) {
                console.log(colorText('\n⚠️  ERRO 405 - Limpando sessão...', '#ff9800'))
                await cleanCreds()
                await new Promise(resolve => setTimeout(resolve, 2000))
                needReconnect = true
            } else if (errorCode == DisconnectReason?.restartRequired){
                showConsoleError(new Error(botTexts.disconnected.restart), 'CONNECTION')
                await new Promise(resolve => setTimeout(resolve, 1000))
                needReconnect = true
            } else {
                showConsoleError(new Error(buildText(botTexts.disconnected.bad_connection, errorCode.toString(), lastDisconnect?.error?.message)), 'CONNECTION')
                await new Promise(resolve => setTimeout(resolve, 2000))
                needReconnect = true
            }
        }

        return needReconnect
    } catch{
        return false
    }
}

 async function checkOwnerRegister(){
    const owner = await new UserController().getOwner()

    if (!owner){
        console.log(colorText(botTexts.owner_not_found, "#d63e3e"))
    } else {
        console.log(colorText(botTexts.owner_registered))
    }
}