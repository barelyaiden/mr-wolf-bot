const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');

class UnmuteCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'unmute',
            aliases: ['unmule'],
            description: 'Unmute a member.',
            detailedDescription: {
                usage: '[member]',
                example: '@bringbacksledge'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.ManageMessages],
            requiredClientPermissions: [PermissionsBitField.Flags.ManageRoles]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);

        if (!member) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (member.id === message.client.user.id) return message.reply('I can\'t be muted in the first place!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.reply('Moderators can\'t be muted!');
        if (!member.roles.cache.some(role => role.name === roles.mutedRole)) return message.reply('That member is not muted.');

        const mutedRole = await member.guild.roles.cache.find(role => role.name === roles.mutedRole);
        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been unmuted.`, iconURL: `${member.displayAvatarURL({ extension: 'png', dynamic: true })}` })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        try {
            await member.roles.remove(mutedRole);
        } catch {
            return message.reply('Failed to unmute that member.');
        }

        await logsChannel.send({ embeds: [logEmbed] });
        return message.reply(`${member} shall speak once more!`);
    }
}

module.exports = {
    UnmuteCommand
};