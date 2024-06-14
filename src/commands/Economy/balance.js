const { Command } = require('@sapphire/framework');
const random = require('random');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class BalanceCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'balance',
            aliases: ['bal'],
            description: 'Check your balance!',
            detailedDescription: {
                usage: '(member)',
                example: '@barelyaiden'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);

        if (member && member.user.id === message.client.user.id) {
            const responses = [
                'Oh I\'m the OWNER of this operation ALL of the server\'s money is mine sucker!',
                'I don\'t have to tell you ANYTHING.',
                'Beep Boop Don\'t Know!',
                'Maybe if I stand still they\'ll go away.',
                'I totally have **10,000,000 💵 Moneys**! Yeah...',
                'How much do YOU have brokie.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member && member.user.bot) {
            const responses = [
                'I\'m sure bots have more important things to do than gamble away all their revenue 💀',
                'Sorry I don\'t let bots in!',
                'Our contracts do not account for bots.',
                'I got sued once by another bot so I\'m not letting them in.',
                'They have **0 💵 Moneys**! Cause they suck!',
                'Worry about your wallet.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        if (!member || member && member.user.id === message.author.id) {
            const selfMoneys = await fetchEconomyData(message, message.author.id);
            return message.channel.send(`You have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);
        } else {
            const Moneys = await fetchEconomyData(message, member.user.id);
            return message.channel.send(`${member.user.username} has **${Moneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);
        }
    }
}

module.exports = {
    BalanceCommand
};
