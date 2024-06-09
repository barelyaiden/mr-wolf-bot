const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { roles, channels } = require('../../../config.json');
const commonMessages = require('../../utilities/commonMessages');

class KillCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kill',
            description: 'Kill a member.',
            detailedDescription: {
                usage: '[member] (reason)',
                example: '@radthew Being a fucking FURFAG'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.ManageMessages],
            requiredClientPermissions: [PermissionsBitField.Flags.ManageNicknames]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const reason = args.finished ? 'No reason ¯\\_(ツ)_/¯' : await args.rest('string');

        if (!member) return commonMessages.sendUsageEmbed(this, message, args);
        if (member.id === message.client.user.id) return message.channel.send('Can\'t kill me!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.channel.send('Can\'t kill moderators!');
        if (member.roles.cache.some(role => role.name === roles.deadRole)) return message.channel.send('That member is already dead.');

        const deadRole = await member.guild.roles.cache.find(role => role.name === roles.deadRole);
        const originalNickname = member.nickname === null ? member.user.globalName : member.nickname;

        await member.roles.add(deadRole);
        await member.setNickname(`[DEAD] ${(member.nickname === null ? member.user.globalName : member.nickname).substring(0, 24)}`);
        await message.client.DeadMembers.create({
            userId: member.user.id,
            nickname: member.nickname,
            originalNickname: originalNickname
        });

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} was killed.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Reason:', value: reason }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        const successEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username} has been killed!`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Reason:', value: reason }
            )
            .setImage('attachment://kill.gif')
            .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });
        return message.channel.send({ embeds: [successEmbed], files: ['./assets/images/kill.gif'] });
    }
}

module.exports = {
    KillCommand
};
