const { Command } = require('@sapphire/framework');
const { PermissionsBitField } = require('discord.js');
const { createBasicEmbed, sendUsageEmbed } = require('../../utilities/commonMessages');
const { roles, channels } = require('../../../config.json');

class ReviveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'revive',
            description: 'Revive a dead member.',
            detailedDescription: {
                usage: '[member] (reason)',
                example: '@radthew Fiinee you can live again'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.ManageMessages],
            requiredClientPermissions: [PermissionsBitField.Flags.ManageNicknames]
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const reason = args.finished ? 'No reason ¯\\_(ツ)_/¯' : await args.rest('string');

        if (!member) return sendUsageEmbed(this, args, message);
        if (member.id === message.client.user.id) return message.channel.send('I can\'t be killed in the first place!');
        if (member.roles.cache.some(role => role.name === roles.moderatorRole)) return message.channel.send('Moderators can\'t be killed!');
        if (!member.roles.cache.some(role => role.name === roles.deadRole)) return message.channel.send('That member is not dead.');

        const deadRole = await member.guild.roles.cache.find(role => role.name === roles.deadRole);
        const deadMember = await member.client.DeadMembers.findOne({ where: { userId: member.user.id } });

        await message.client.DeadMembers.destroy({ where: { userId: member.user.id } });
        await member.roles.remove(deadRole);
        await member.setNickname(deadMember.originalNickname);

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = createBasicEmbed(`${member.user.username} was revived.`, member);
        logEmbed.addFields(
            { name: 'Member:', value: `${member}`, inline: true },
            { name: 'Moderator:', value: `${message.author}`, inline: true },
            { name: 'Reason:', value: reason }
        );
        logEmbed.setFooter({ text: `ID: ${member.user.id}` });

        const successEmbed = createBasicEmbed(`${member.user.username} has been revived!`, member);
        successEmbed.addFields(
            { name: 'Reason:', value: reason }
        );
        successEmbed.setImage('attachment://revive.gif');

        await logsChannel.send({ embeds: [logEmbed] });
        return message.channel.send({ embeds: [successEmbed], files: ['./assets/images/revive.gif'] });
    }
}

module.exports = {
    ReviveCommand
};
