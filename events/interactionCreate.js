const Discord = require('discord.js');

module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = bot.commands.get(interaction.commandName);
        if (command) {
            command.run(bot, interaction);
        }
    }
};