const TelegramApi = require('node-telegram-bot-api')
const token = '7468107906:AAFJ-bYu4omMwbf6uBZhgrVWgUHrz4yTi-I'

const {gameAgainOptions, gameOptions}= require('./options')
const bot = new TelegramApi(token, { polling: true })

const chats = {}


const againGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now, I will guess a number and then you could to guess it! (number in range 0-9) ')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Let's guess a number!`, gameOptions)

}
const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Welcome' },
        { command: '/info', description: 'info user' },
        { command: '/game', description: 'play game' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/8cd/11b/8cd11bf5-6935-465a-b247-c4cddd6f409f/1.webp')
            return bot.sendMessage(chatId, "Welcome to my first chatBot!")
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `You call ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return againGame(chatId)
        }

        return bot.sendMessage(chatId, "I don't understand you, try again please")

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return againGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Congratulations, you guessed number ${chats[chatId]}`, gameAgainOptions)
        } else {
            return bot.sendMessage(chatId, `Unfortunately, You don't guessed a bot's number ${chats[chatId]}, please try again`, gameAgainOptions)
        }

    })
}
start()