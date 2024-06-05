const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');
const commonMessages = require('../../utilities/commonMessages');

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

        if (!member) return commonMessages.sendUsageEmbed(this, message, args);
        if (member.id === message.client.user.id) return message.channel.send('You can\'t silence me in the first place!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.channel.send('Moderators can\'t be muted!');
        if (!member.roles.cache.some(role => role.name === roles.mutedRole)) return message.channel.send('That member is not muted.');

        const mutedRole = await member.guild.roles.cache.find(role => role.name === roles.mutedRole);
        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} was unmuted.`, iconURL: member.displayAvatarURL({ extension: 'png', dynamic: true }) })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();
        const successEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been unmuted.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        try {
            await member.roles.remove(mutedRole);
            await message.client.MutedMembers.destroy({ where: { userId: member.user.id } });
        } catch {
            return message.channel.send('Failed to unmute that member.');
        }

        await logsChannel.send({ embeds: [logEmbed] });
        return message.channel.send({ embeds: [successEmbed] });
    }
}

module.exports = {
    UnmuteCommand
};
