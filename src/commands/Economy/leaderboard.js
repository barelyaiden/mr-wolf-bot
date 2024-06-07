const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class LeaderboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'leaderboard',
            aliases: ['lb', 'top'],
            description: 'Check the server leaderboard!'
        });
    }

    async messageRun(message) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('left')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⬅️'),
                new ButtonBuilder()
                    .setCustomId('right')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('➡️'),
            );

        const { count, rows } = await message.client.FagBucks.findAndCountAll({ order: [['amount', 'DESC']] });

        const emptyLeaderboardEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: '🏆 Server Leaderboard' })
            .setDescription('Looks like no one has any **💵 FagBucks** :(')
            .setFooter({ text: 'You should really gamble your life savings away and start the economy!' })
            .setTimestamp();

        if (count < 1) return message.channel.send({ embeds: [emptyLeaderboardEmbed] });

        let currentPage = 0;
        const embeds = await this.generateEmbeds(rows, message);

        if (embeds.length < 2) {
            return message.channel.send({ embeds: [embeds[currentPage]] });
        } else {
            embeds[currentPage].setFooter({ text: `Page: ${currentPage+1}/${embeds.length}` });

            const msg = await message.channel.send({ embeds: [embeds[currentPage]], components: [row] });

            setTimeout(async function() {
                await msg.edit({ components: [] });
            }, 30000);
        }

        const filter = i => i.user.id === message.author.id;

        const collector = await message.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'left') {
                if (currentPage !== 0) {
                    --currentPage;
                    await i.update({ embeds: [embeds[currentPage]] });
                }
            } else if (i.customId === 'right') {
                if (currentPage < embeds.length-1) {
                    currentPage++;
                    embeds[currentPage].setFooter({ text: `Page: ${currentPage+1}/${embeds.length}` });
                    await i.update({ embeds: [embeds[currentPage]] });
                }
            }
        });
    }

    async generateEmbeds(rows, message) {
        const embeds = [];
        let a = 10;
        let b = 0;

        for (let i = 0; i < rows.length; i += 10) {
            const current = rows.slice(i, a);
            a += 10;

            const topSpenders = current.map(spender => {
                b += 1;
                return `${b}. ${message.guild.members.cache.get(spender.userId)} - 💵 ${spender.amount}`;
            }).join('\n');

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(0xfbfbfb)
                .setAuthor({ name: '🏆 Server Leaderboard' })
                .setDescription(topSpenders)
                .setTimestamp();

            embeds.push(leaderboardEmbed);
        }

        return embeds;
    }
}

module.exports = {
    LeaderboardCommand
};
