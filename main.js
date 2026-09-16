const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})
const loadCommands = require("./loaders/loadCommands")
const loadEvents = require("./loaders/loadEvents")
const config = require('./config.js')

bot.commands = new Discord.Collection();

console.log('\x1b[34m%s\x1b[0m',"[ LOADER ]",` Chargement des commandes`)
loadCommands(bot)

console.log('\x1b[34m%s\x1b[0m',"[ LOADER ]",` Chargement des évènements`)
loadEvents(bot)


bot.login(config.token);




