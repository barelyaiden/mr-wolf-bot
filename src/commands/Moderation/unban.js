const { Command } = require('@sapphire/framework');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
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

        if (!userId) return message.reply(`Usage: \`${this.container.client.options.defaultPrefix}${this.name} ${this.detailedDescription.usage}\``);
        if (userId === message.client.user.id) return message.reply('I can\'t be banned in the first place!');
        if (userId === owners[0]) return message.reply('The server owner can\'t be banned in the first place!');

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);
        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: 'A user been unbanned.' })
            .addFields(
                { name: 'User ID:', value: userId, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
            )
            .setTimestamp();

        try {
            await message.guild.members.unban(userId);
        } catch {
            return message.reply('Failed to unban that user.');
        }

        await logsChannel.send({ embeds: [logEmbed] });
        return message.reply(`Unbanned user \`${userId}\``);
    }
}

module.exports = {
    UnbanCommand
};