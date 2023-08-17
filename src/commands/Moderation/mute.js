const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');
const { setTimeout } = require('node:timers/promises');
const ms = require('ms');

class MuteCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'mute',
            aliases: ['mule'],
            description: 'Mute a member.',
            detailedDescription: {
                usage: '[member] (duration) (reason)',
                example: '@bringbacksledge 3h Talking about bringing back Sledge.'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.ManageMessages],
            requiredClientPermissions: [PermissionsBitField.Flags.ManageRoles]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const duration = await args.pick('string').catch(() => null);
        let reason = args.finished ? 'No reason ¯\\_(ツ)_/¯' : await args.rest('string');

        if (!member) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (member.id === message.client.user.id) return message.reply('Can\'t mute me!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.reply('Can\'t mute moderators!');
        if (member.roles.cache.some(role => role.name === roles.mutedRole)) return message.reply('That member is already muted.');

        const mutedRole = await member.guild.roles.cache.find(role => role.name === roles.mutedRole);
        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const attachment = new AttachmentBuilder('./assets/images/mute.gif');
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been muted.`, iconURL: `${member.displayAvatarURL({ extension: 'png', dynamic: true })}` })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Reason:', value: reason }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        try {
            await member.roles.add(mutedRole);
        } catch {
            return message.reply('Failed to mute that member.');
        }

        await member.createDM();

        if (!duration || !/\d/.test(duration)) {
            if (duration) reason = `${duration} ${reason}`;
            await member.send(`You have been muted in ${message.guild.name}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting muted.`));
            await logsChannel.send({ embeds: [logEmbed] });
            return message.reply({ content: `Muted ${member}: ${reason}`, files: [attachment] });
        } else {
            logEmbed.addFields({ name: 'Duration:', value: ms(ms(duration), { long: true }) });
            await member.send(`You have been muted in ${message.guild.name} for ${ms(ms(duration), { long: true })}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting muted.`));
            await logsChannel.send({ embeds: [logEmbed] });
            await message.reply({ content: `Muted ${member} for ${ms(ms(duration), { long: true })}: ${reason}`, files: [attachment] });
            await setTimeout(ms(duration));
            if (member.roles.cache.some(role => role.name === roles.mutedRole)) {
                return member.roles.remove(mutedRole);
            } else {
                return;
            }
        }
    }
}

module.exports = {
    MuteCommand
};