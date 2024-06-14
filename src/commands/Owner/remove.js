const { Command } = require('@sapphire/framework');
const { createBasicEmbed, sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');
const { channels } = require('../../../config.json');

class RemoveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'remove',
            description: 'Artificially remove money from someone\'s balance.',
            detailedDescription: {
                usage: '[member] [amount]',
                example: '@zman4302 1000'
            },
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        const amount = await args.pick('number').catch(() => null);
        if (!member || !amount || isNaN(amount)) return sendUsageEmbed(this, args, message);
        if (amount < 0) return message.channel.send('You can only input positive numbers!');
        if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');

        if (member.user.bot) return message.channel.send('It is not possible to remove from a bot\'s balance.');

        const Moneys = await fetchEconomyData(message, member.user.id);

        await Moneys.update({ amount: Moneys.amount - amount });

        const logsChannel = await message.guild.channels.cache.find(ch => ch.name === channels.logsChannel);

        const logEmbed = createBasicEmbed(`${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} balance was updated.`, member);
        logEmbed.addFields(
            { name: 'Member:', value: `${member}`, inline: true },
            { name: 'Moderator:', value: `${message.author}`, inline: true },
            { name: 'Amount:', value: `-${amount.toLocaleString('en-US')}` }
        );
        logEmbed.setFooter({ text: `ID: ${member.user.id}` });

        await logsChannel.send({ embeds: [logEmbed] });

        if (member.user.id === message.author.id) {
            return message.channel.send(`Successfully removed **${amount.toLocaleString('en-US')} 💵 Moneys** from your balance.`);
        } else {
            return message.channel.send(`Successfully removed **${amount.toLocaleString('en-US')} 💵 Moneys** from ${member.user.username}${(member.user.username.endsWith('s')) ? '\'' : '\'s'} balance.`);
        }
    }
}

module.exports = {
    RemoveCommand
};
