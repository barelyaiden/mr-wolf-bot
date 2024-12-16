const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedColor, sendUsageEmbed } = require('../../utilities/commonMessages');
const { roles } = require('../../../config.json');

class MovieListCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'movielist',
            description: 'A list of movies we need to watch.',
            detailedDescription: {
                usage: '(add/remove) [movie name]',
                example: 'add The Bad Guys'
            }
        });
    }

    async messageRun(message, args) {
        const action = await args.pick('string').catch(() => null);
        const movieName = await args.rest('string').catch(() => null);
        const actions = ['add', 'remove'];

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('left')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⬅️')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('right')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('➡️'),
            );

        if (!action && !movieName) {
            const { count, rows } = await message.client.MovieList.findAndCountAll();

            const emptyMovieListEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: '🍿 Movie List' })
                .setDescription('The list is empty!')
                .setFooter({ text: 'Check the help embed to learn how to add movies to the list.' })
                .setTimestamp();

            if (count < 1) return message.channel.send({ embeds: [emptyMovieListEmbed] });

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
                        if (currentPage === 0) row.components[0].setDisabled(true);
                        row.components[1].setDisabled(false);
                        await i.update({ embeds: [embeds[currentPage]], components: [row] });
                    }
                } else if (i.customId === 'right') {
                    if (currentPage < embeds.length-1) {
                        currentPage++;
                        if (currentPage === embeds.length-1) row.components[1].setDisabled(true);
                        row.components[0].setDisabled(false);
                        embeds[currentPage].setFooter({ text: `Page: ${currentPage+1}/${embeds.length}` });
                        await i.update({ embeds: [embeds[currentPage]], components: [row] });
                    }
                }
            });
        } else if (action) {
            if (!actions.includes(action) || !movieName) {
                return sendUsageEmbed(this, args, message);
            }
            if (!message.member.roles.cache.some(role => role.name === roles.moderatorRole)) return;

            const movie = await message.client.MovieList.findOne({ where: { movieName: movieName } });

            if (action === 'add') {
                if (movie) {
                    const movieAlreadyExistsEmbed = new EmbedBuilder()
                        .setColor(embedColor)
                        .setAuthor({ name: `🍿 That movie is already on the list.` })
                        .setTimestamp();

                    return message.channel.send({ embeds: [movieAlreadyExistsEmbed] });
                } else {
                    await message.client.MovieList.create({ movieName: movieName });
    
                    const movieAddedEmbed = new EmbedBuilder()
                        .setColor(embedColor)
                        .setAuthor({ name: `🍿 ${movieName} has been added to the list!` })
                        .setTimestamp();
    
                    return message.channel.send({ embeds: [movieAddedEmbed] });
                }
            } else if (action === 'remove') {
                if (movie) {
                    await message.client.MovieList.destroy({ where: { movieName: movieName } });

                    const movieRemovedEmbed = new EmbedBuilder()
                        .setColor(embedColor)
                        .setAuthor({ name: `🍿 ${movieName} has been removed from the list.` })
                        .setTimestamp();

                    return message.channel.send({ embeds: [movieRemovedEmbed] });
                } else {
                    const movieNotExistEmbed = new EmbedBuilder()
                        .setColor(embedColor)
                        .setAuthor({ name: `🍿 That movie does not exist on the list.` })
                        .setTimestamp();

                    return message.channel.send({ embeds: [movieNotExistEmbed] });
                }
            }
        }
    }

    async generateEmbeds(rows) {
        const embeds = [];
        let a = 10;
        let b = 0;

        for (let i = 0; i < rows.length; i += 10) {
            const current = rows.slice(i, a);
            a += 10;

            const movieList = current.map(movie => {
                b += 1;
                return `${b}. ${movie.movieName}`;
            }).join('\n');

            const movieListEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: '🍿 Movie List' })
                .setDescription(movieList)
                .setTimestamp();

            embeds.push(movieListEmbed);
        }

        return embeds;
    }
}

module.exports = {
    MovieListCommand
};
