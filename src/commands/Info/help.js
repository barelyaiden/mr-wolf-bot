const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
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
            const commands = this.container.stores.get('commands');
            const infoCommands = commands.filter((command) => command.fullCategory[0] === 'Info');
            const utilityCommands = commands.filter((command) => command.fullCategory[0] === 'Utility');
            const funCommands = commands.filter((command) => command.fullCategory[0] === 'Fun');
            const moderationCommands = commands.filter((command) => command.fullCategory[0] === 'Moderation');

            const commandsEmbed = new EmbedBuilder()
                .setColor(0xfbfbfb)
                .setAuthor({ name: 'List of available commands.', iconURL: message.client.user.displayAvatarURL({ extension: 'png', dynamic: true }) })
                .addFields(
                    { name: 'Info:', value: `${prefix}${(infoCommands.map(command => command.name)).join(`\n${prefix}`)}`, inline: true },
                    { name: 'Utility:', value: `${prefix}${(utilityCommands.map(command => command.name)).join(`\n${prefix}`)}`, inline: true },
                    { name: 'Fun:', value: `${prefix}${(funCommands.map(command => command.name)).join(`\n${prefix}`)}`, inline: true }
                )
                .setTimestamp();

            if (message.channel.parent.name === categories.moderatorCategory) {
                commandsEmbed.addFields(
                    { name: 'Moderation:', value: `${prefix}${(moderationCommands.map(command => command.name)).join(`\n${prefix}`)}`, inline: true }
                );
            }

            return message.reply({ embeds: [commandsEmbed] });
        } else {
            const command = this.container.stores.get('commands').get(commandName);
            if (!command) return;
            if (command.category === 'Moderation' && !message.member.roles.cache.some(role => role.name === roles.moderatorRole)) return;
            if (command.category === 'Secret') return;
            if (command.options.preconditions && command.options.preconditions[0] === 'OwnerOnly' && !owners.includes(message.author.id)) return;

            const commandEmbed = new EmbedBuilder()
                .setColor(0xfbfbfb)
                .setAuthor({ name: `Command: ${prefix}${command.name}`, iconURL: message.client.user.displayAvatarURL({ extension: 'png', dynamic: true }) })
                .setDescription(command.description)
                .addFields(
                    { name: 'Category:', value: command.category, inline: true }
                )
                .setTimestamp();

            if (command.aliases.length !== 0) commandEmbed.addFields({ name: 'Aliases:', value: command.aliases.join(', '), inline: true });
            if (command.detailedDescription.usage) {
                commandEmbed.addFields(
                    { name: 'Usage:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.usage}\`\`\`` },
                    { name: 'Example:', value: `\`\`\`${prefix}${command.name} ${command.detailedDescription.example}\`\`\`` }
                );
            }

            return message.reply({ embeds: [commandEmbed] });
        }
    }
}

module.exports = {
    HelpCommand
};