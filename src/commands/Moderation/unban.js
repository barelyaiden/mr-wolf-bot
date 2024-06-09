const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { owners, channels } = require('../../../config.json');
const commonMessages = require('../../utilities/commonMessages');

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

        if (!userId) return commonMessages.sendUsageEmbed(this, message, args);
        if (userId === message.client.user.id) return message.channel.send('I can\'t be banned in the first place!');
        if (userId === owners[0]) return message.channel.send('The server owner can\'t be banned in the first place!');

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);
        
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: 'A user was unbanned.', iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'User ID:', value: userId, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
            )
            .setTimestamp();
        
        const successEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `User Id: ${userId} has been unbanned.`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

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
