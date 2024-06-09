const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');
const commonMessages = require('../../utilities/commonMessages');

class KickCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kick',
            description: 'Kick a member.',
            detailedDescription: {
                usage: '[member] (reason)',
                example: '@markus Posting too much furry art.'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.KickMembers],
            requiredClientPermissions: [PermissionsBitField.Flags.KickMembers]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const reason = args.finished ? 'No reason ¯\\_(ツ)_/¯' : await args.rest('string');

        if (!member) return commonMessages.sendUsageEmbed(this, message, args);
        if (member.id === message.client.user.id) return message.channel.send('Can\'t kick me!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.channel.send('Can\'t kick moderators!');

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);
        
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} was kicked.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Reason:', value: reason }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();
        
        const successEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been kicked.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Reason:', value: reason }
            )
            .setTimestamp();

        try {
            await member.createDM();
            await member.send(`You have been kicked from ${message.guild.name}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting kicked.`));
            await member.kick(`${reason}`);
            await logsChannel.send({ embeds: [logEmbed] });
            return message.channel.send({ embeds: [successEmbed] });
        } catch {
            return message.channel.send('Failed to kick that member.');
        }
    }
}

module.exports = {
    KickCommand
};
