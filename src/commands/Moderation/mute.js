const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');
const { setTimeout } = require('node:timers/promises');
const commonMessages = require('../../utilities/commonMessages');
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

        if (!member) return commonMessages.sendUsageEmbed(this, message, args);
        if (member.id === message.client.user.id) return message.channel.send('Can\'t mute me!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.channel.send('Can\'t mute moderators!');
        if (member.roles.cache.some(role => role.name === roles.mutedRole)) return message.channel.send('That member is already muted.');

        const mutedRole = await member.guild.roles.cache.find(role => role.name === roles.mutedRole);
        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} was muted.`, iconURL: member.displayAvatarURL({ extension: 'png', dynamic: true }) })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Reason:', value: reason }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();
        
        const successEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been muted.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setImage('attachment://mute.gif')
            .setTimestamp();

        try {
            await member.roles.add(mutedRole);
            await message.client.MutedMembers.create({
                userId: member.user.id
            });
        } catch {
            return message.channel.send('Failed to mute that member.');
        }

        await member.createDM();

        if (!duration || !/\d/.test(duration)) {
            if (duration) reason = `${duration} ${reason}`;
            successEmbed.addFields({ name: 'Reason:', value: reason });
            await member.send(`You have been muted in ${message.guild.name}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting muted.`));
            await logsChannel.send({ embeds: [logEmbed] });
            return message.channel.send({ embeds: [successEmbed], files: ['./assets/images/mute.gif'] });
        } else {
            logEmbed.addFields({ name: 'Duration:', value: ms(ms(duration), { long: true }) });
            successEmbed.addFields(
                { name: 'Reason:', value: reason },
                { name: 'Duration:', value: `${ms(ms(duration), { long: true })}` }
            );
            await member.send(`You have been muted in ${message.guild.name} for ${ms(ms(duration), { long: true })}: ${reason}`).catch(() => this.container.logger.info(`Couldn't DM ${member.user.username} (${member.user.id}) for getting muted.`));
            await logsChannel.send({ embeds: [logEmbed] });
            await message.channel.send({ embeds: [successEmbed], files: ['./assets/images/mute.gif'] });
            await setTimeout(ms(duration));
            if (member.roles.cache.some(role => role.name === roles.mutedRole)) {
                await member.roles.remove(mutedRole);
                return message.client.MutedMembers.destroy({ where: { userId: member.user.id } });
            } else {
                return;
            }
        }
    }
}

module.exports = {
    MuteCommand
};
