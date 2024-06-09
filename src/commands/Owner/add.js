const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { channels } = require('../../../config.json');
const commonMessages = require('../../utilities/commonMessages');

class AddCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'add',
            description: 'Artificially add to someone\'s balance.',
            detailedDescription: {
                usage: '[member]',
                example: '@markuwus'
            },
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const amount = await args.pick('number').catch(() => null);
        if (!member || !amount || isNaN(amount) || amount < 0) return commonMessages.sendUsageEmbed(this, message, args);
        if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');

        if (member.user.bot) return message.channel.send('It is not possible to add to a bot\'s balance.');

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: member.user.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
        }

        await fagBucks.update({ amount: fagBucks.amount + amount });

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = new EmbedBuilder()
            .setColor(0xfbfbfb)
            .setAuthor({ name: `${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} balance was updated.`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: 'Member:', value: `${member}`, inline: true },
                { name: 'Moderator:', value: `${message.author}`, inline: true },
                { name: 'Amount:', value: `+${amount}` }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });

        if (member.user.id === message.author.id) {
            return message.channel.send(`Successfully added **${amount} 💵 FagBucks** to your balance.`);
        } else {
            return message.channel.send(`Successfully added **${amount} 💵 FagBucks** to ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} balance.`);
        }
    }
}

module.exports = {
    AddCommand
};
