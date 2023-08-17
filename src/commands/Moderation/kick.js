const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');

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

        if (!member) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (member.id === message.client.user.id) return message.reply('Can\'t kick me!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.reply('Can\'t kick moderators!');

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been kicked.`, iconURL: `${member.displayAvatarURL({ extension: 'png', dynamic: true })}` })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Reason:', value: reason }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        try {
            await member.createDM();
            await member.send(`You have been kicked from ${message.guild.name}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting kicked.`));
            await member.kick(`${reason}`);
            await logsChannel.send({ embeds: [logEmbed] });
            return message.reply(`Kicked ${member}: ${reason}`);
        } catch {
            return message.reply('Failed to kick that member.');
        }
    }
}

module.exports = {
    KickCommand
};