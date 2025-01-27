const { Command } = require('@sapphire/framework');
const { PermissionsBitField } = require('discord.js');
const { createBasicEmbed, sendUsageEmbed } = require('../../utilities/commonMessages');
const { roles, channels } = require('../../../config.json');

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

        if (!member) return sendUsageEmbed(this, args, message);
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

        const logEmbed = createBasicEmbed(`${member.user.username} was killed.`, member);
        logEmbed.addFields(
            { name: 'Member:', value: `${member}`, inline: true },
            { name: 'Moderator:', value: `${message.author}`, inline: true },
            { name: 'Reason:', value: reason }
        );
        logEmbed.setFooter({ text: `ID: ${member.user.id}` });

        const successEmbed = createBasicEmbed(`${member.user.username} has been killed!`, member);
        successEmbed.addFields(
            { name: 'Reason:', value: reason }
        );
        successEmbed.setImage('attachment://kill.gif');

        await logsChannel.send({ embeds: [logEmbed] });
        return message.channel.send({ embeds: [successEmbed], files: ['./assets/images/kill.gif'] });
    }
}

module.exports = {
    KillCommand
};
