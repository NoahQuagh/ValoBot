const Discord = require('discord.js');
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord.js');

module.exports = async bot => {
    let commands = [];

    bot.commands.forEach(command => {
        let slashCommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                const opt = command.options[i];
                // Utilise la variable opt pour éviter les fautes de frappe
                slashCommand[`add${opt.type.slice(0, 1).toUpperCase() + opt.type.slice(1).toLowerCase()}Option`](option =>
                    option.setName(opt.name)
                        .setDescription(opt.description)
                        .setRequired(opt.required || false)
                );
            }
        }

        commands.push(slashCommand);
    });

    const rest = new REST({ version: "10" }).setToken(bot.token);
    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });

    console.log('\x1b[32m%s\x1b[0m', "[ OK ]", ` SlashCommands chargées`);
};