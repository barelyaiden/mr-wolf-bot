const { Command } = require('@sapphire/framework');
const random = require('random');

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
                'I totally have **10,000,000 💵 FagBucks**! Yeah...',
                'How much do YOU have brokie.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member && member.user.bot) {
            const responses = [
                'I\'m sure bots have more important things to do than gamble away all their revenue 💀',
                'Sorry I don\'t let bots in!',
                'Our contracts do not account for bots.',
                'I got sued once by another bot so I\'m not letting them in.',
                'They have **0 💵 FagBucks**! Cause they suck!',
                'Worry about your wallet.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        if (!member || member.user.id === message.author.id) {
            let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

            if (!selfFagBucks) {
                await message.client.FagBucks.create({
                    userId: message.author.id,
                    amount: 100,
                    bank: 0
                });
    
                selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
            }

            return message.channel.send(`You have **${selfFagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);
        } else {
            let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

            if (!fagBucks) {
                await message.client.FagBucks.create({
                    userId: member.user.id,
                    amount: 100,
                    bank: 0
                });
    
                fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
            }

            return message.channel.send(`${member.user.username} has **${fagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);
        }
    }
}

module.exports = {
    BalanceCommand
};
