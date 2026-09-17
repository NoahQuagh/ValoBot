const Discord = require("discord.js");

module.exports = {
    name: "stats",
    description: "Affiche les statistiques des derniers matchs d'un joueur Valorant",
    permission: "Aucune",
    dm: true,
    options: [
        {
            type: "String",
            name: "joueur",
            description: "Identifiant Valorant sous la forme Pseudo#Tag (ex: Player#1234)",
            required: true
        }
    ],

    async run(bot, interaction) {
        const input = interaction.options.getString("joueur");

        if (!input.includes("#")) {
            return interaction.reply({
                content: "Veuillez indiquer un format valide : **Pseudo#Tag**.",
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
                `https://api.henrikdev.xyz/valorant/v3/matches/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20`,
                { headers }
            );

            const result = await response.json();

            if (response.status !== 200 || !result.data || result.data.length === 0) {
                const errorMsg = result.errors ? result.errors[0].message : "Aucun match trouvé ou profil privé.";
                return interaction.editReply(`❌ Erreur : ${errorMsg}`);
            }

            const matches = result.data;

            let totalKills = 0;
            let totalDeaths = 0;
            let totalAssists = 0;
            const agentsCount = {};

            matches.forEach(match => {
                const player = match.players?.all_players?.find(
                    p => p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase()
                );

                if (player) {
                    totalKills += player.stats?.kills || 0;
                    totalDeaths += player.stats?.deaths || 0;
                    totalAssists += player.stats?.assists || 0;


                    const agent = player.character || "Inconnu";
                    agentsCount[agent] = (agentsCount[agent] || 0) + 1;
                }
            });

            let mostPlayedAgent = "Aucun";
            let maxCount = 0;
            for (const [agent, count] of Object.entries(agentsCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostPlayedAgent = agent;
                }
            }

            const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;
            const totalKDA =((totalKills+totalAssists)/totalKills).toFixed(2)

            const embed = new Discord.EmbedBuilder()
                .setTitle(`Statistiques du joueur ${name}#${tag}`)
                .setColor("#FF4655")
                .addFields(
                    { name: "\u200B", value: `**K/D Ratio :** ${kdRatio}\n**KDA global :** ${totalKDA}\n**Agent le plus joué :** ${mostPlayedAgent} (${maxCount} matchs)`, inline: false },
                    { name: "\u200B", value: "**3 derniers matchs compétitifs**", inline: false }
                )
                .setTimestamp();

            const lastThreeMatches = matches.slice(0, 3);
            lastThreeMatches.forEach((match, index) => {
                const map = match.metadata?.map || "Carte inconnue";
                const player = match.players?.all_players?.find(
                    p => p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase()
                );

                if (player) {
                    const kda = `${player.stats?.kills || 0}/${player.stats?.deaths || 0}/${player.stats?.assists || 0}`;
                    const agent = player.character || "Agent inconnu";
                    const hsRate = player.stats?.headshots && (player.stats?.headshots + player.stats?.bodyshots + player.stats?.legshots) > 0
                        ? Math.round((player.stats.headshots / (player.stats.headshots + player.stats.bodyshots + player.stats.legshots)) * 100)
                        : 0;

                    embed.addFields({
                        name: `${map} (${agent})`,
                        value: `**KDA :** ${kda}\n**Tirs tête :** ${hsRate}%`,
                        inline: true
                    });
                }
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply("Une erreur est survenue lors de la récupération des statistiques.");
        }
    }
};