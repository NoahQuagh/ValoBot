const Discord = require("discord.js");

module.exports = {
    name: "rank",
    description: "Affiche le rang Valorant d'un joueur",
    permission: "Aucune",
    dm: true,
    options: [
        {
            type: "String",
            name: "joueur",
            description: "Ton identifiant Valorant sous la forme Pseudo#Tag (ex: Player#1234)",
            required: true
        }
    ],

    async run(bot, interaction) {
        const input = interaction.options.getString("joueur");

        if (!input.includes("#")) {
            return interaction.reply({
                content: "Veuillez indiquer un format valide : **Pseudo#Tag** (ex: `Arracheur2lavabo#1000`).",
                ephemeral: true
            });
        }

        const [name, tag] = input.split("#");
        await interaction.deferReply();

        try {
            const config = require("../config.js");
            const headers = {};
            if (config.henrikApiKey) {
                headers["Authorization"] = config.henrikApiKey;
            }

            const response = await fetch(
                `https://api.henrikdev.xyz/valorant/v3/mmr/eu/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
                { headers }
            );

            const result = await response.json();

            if (response.status !== 200 || !result.data) {
                const errorMsg = result.errors ? result.errors[0].message : "Joueur introuvable ou profil privé.";
                return interaction.editReply(`Erreur : ${errorMsg}`);
            }

            const mmrData = result.data;
            const currentData = mmrData.current;

            if (!currentData || !currentData.tier) {
                return interaction.editReply(`Aucun rang trouvé pour **${name}#${tag}**.`);
            }

            const rankName = currentData.tier.name || "Unranked";
            const rr = currentData.rr ?? 0;
            const lastChange = currentData.last_change ?? 0;
            const changeSign = lastChange >= 0 ? "+" : "";

            const embed = new Discord.EmbedBuilder()
                .setTitle(`Rang Valorant : ${name}#${tag}`)
                .setColor("#FF4655")
                .addFields(
                    { name: "Rang actuel", value: `${rankName}`, inline: true },
                        { name: "RR", value: `${rr} / 100`, inline: true },
                        { name: "Dernier match", value: `${changeSign}${lastChange} RR`, inline: true }
                )
                .setThumbnail(currentData.images?.small || currentData.tier.icon || null)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply("Une erreur est survenue lors de la récupération du rang.");
        }
    }
};