const Discord = require('discord.js');
const loadSlashCommand = require('../loaders/loadSlashCommands')

module.exports = async bot =>{

    console.log('\x1b[34m%s\x1b[0m',"[ LOADER ]",` Chargement des SlashCommands`)
    await loadSlashCommand(bot)

    console.log('\x1b[32m%s\x1b[0m',"[ RUNNING ] ",bot.user.tag+" est en ligne");
}