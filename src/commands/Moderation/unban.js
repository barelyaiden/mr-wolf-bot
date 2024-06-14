const { Command } = require('@sapphire/framework');
const { PermissionsBitField } = require('discord.js');
const { createBasicEmbed, sendUsageEmbed } = require('../../utilities/commonMessages');
const { owners, channels } = require('../../../config.json');

class UnbanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'unban',
            description: 'Unban a banned user.',
            detailedDescription: {
                usage: '[user id]',
                example: '904930077517684747'
            },
            requiredUserPermissions: [PermissionsBitField.Flags.BanMembers],
            requiredClientPermissions: [PermissionsBitField.Flags.BanMembers]
        });
    }

    async messageRun(message, args) {
        const userId = await args.pick('string').catch(() => null);

        if (!userId) return sendUsageEmbed(this, args, message);
        if (userId === message.client.user.id) return message.channel.send('I can\'t be banned in the first place!');
        if (userId === owners[0]) return message.channel.send('The server owner can\'t be banned in the first place!');

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = createBasicEmbed('A user was unbanned.', message.client.user);
        logEmbed.addFields(
            { name: 'User ID:', value: userId, inline: true },
            { name: 'Moderator:', value: `${message.author}`, inline: true },
        );

        const successEmbed = createBasicEmbed(`User Id: ${userId} has been unbanned.`, message.client.user);

        try {
            await message.guild.members.unban(userId);
        } catch {
            return message.channel.send('Failed to unban that user.');
        }

        await logsChannel.send({ embeds: [logEmbed] });
        return message.channel.send({ embeds: [successEmbed] });
    }
}

module.exports = {
    UnbanCommand
};
