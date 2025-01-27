const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedColor, createBasicEmbed } = require('../../utilities/commonMessages');
const { owners, roles, categories } = require('../../../config.json');

class HelpCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'help',
            description: 'Get a list of commands and information about them.',
            detailedDescription: {
                usage: '(command name)',
                example: 'ping'
            }
        });
    }

    async messageRun(message, args) {
        const commandName = await args.pick('string').catch(() => null);
        const prefix = this.container.client.options.defaultPrefix;
        
        if (!commandName) {
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

            const commands = this.container.stores.get('commands');

            const economyCommands = commands.filter((command) => command.fullCategory[0] === 'Economy');
            const funCommands = commands.filter((command) => command.fullCategory[0] === 'Fun');
            const infoCommands = commands.filter((command) => command.fullCategory[0] === 'Info');
            const timeCommands = commands.filter((command) => command.fullCategory[0] === 'Time');
            const utilityCommands = commands.filter((command) => command.fullCategory[0] === 'Utility');
            const moderationCommands = commands.filter((command) => command.fullCategory[0] === 'Moderation');
            const ownerCommands = commands.filter((command) => command.fullCategory[0] === 'Owner');

            const economyEmbed = this.createEmbed('Economy', message, economyCommands, prefix);
            const funEmbed = this.createEmbed('Fun', message, funCommands, prefix);
            const infoEmbed = this.createEmbed('Info', message, infoCommands, prefix);
            const timeEmbed = this.createEmbed('Time', message, timeCommands, prefix);
            const utilityEmbed = this.createEmbed('Utility', message, utilityCommands, prefix);
            
            let currentPage = 0;
            const embeds = [economyEmbed, funEmbed, infoEmbed, timeEmbed, utilityEmbed];

            if (message.channel.parent.name === categories.moderatorCategory) {
                const moderationEmbed = this.createEmbed('Moderation', message, moderationCommands, prefix);
                embeds.unshift(moderationEmbed);

                if (message.author.id === owners[0]) {
                    const ownerEmbed = this.createEmbed('Owner', message, ownerCommands, prefix);
                    embeds.unshift(ownerEmbed);
                }
            }

            embeds[currentPage].setFooter({ text: `Page: ${currentPage+1}/${embeds.length}` });
            const msg = await message.channel.send({ embeds: [embeds[currentPage]], components: [row] });
            setTimeout(async function() {
                await msg.edit({ components: [] });
            }, 30000);

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
        } else {
            const command = this.container.stores.get('commands').get(commandName);
            if (!command) return;
            if (command.category === 'Moderation' && !message.member.roles.cache.some(role => role.name === roles.moderatorRole)) return;
            if (command.category === 'Secret') return;
            if (command.options.preconditions && command.options.preconditions[0] === 'OwnerOnly' && !owners.includes(message.author.id)) return;

            const commandEmbed = createBasicEmbed(`Command: ${prefix}${command.name}`, message.client.user);
            commandEmbed.setDescription(command.description);
            commandEmbed.addFields(
                { name: 'Category:', value: command.category, inline: true }
            );

            if (command.aliases.length !== 0) commandEmbed.addFields({ name: 'Aliases:', value: command.aliases.join(', '), inline: true });
            if (command.detailedDescription.usage) {
                commandEmbed.addFields(
                    { name: 'Usage:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.usage}\`\`\`` },
                    { name: 'Example:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.example}\`\`\`` }
                );
            }

            return message.channel.send({ embeds: [commandEmbed] });
        }
    }

    createEmbed(author, message, commands, prefix) {
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `${author} Commands`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        commands.forEach(command => {
            embed.addFields({ name: `${prefix}${command.name}${command.aliases.length > 0 ? ` - ${command.aliases.join(', ')}` : ''}`, value: `${command.description}` });
        });

        return embed;
    }
}

module.exports = {
    HelpCommand
};
