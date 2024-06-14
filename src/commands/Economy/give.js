const { Command } = require('@sapphire/framework');
const random = require('random');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');
const { isFloat } = require('../../utilities/typeCheckers');

class GiveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'give',
            aliases: ['pay'],
            description: 'Give someone else some of your hard earned money!',
            detailedDescription: {
                usage: '[member] [amount]',
                example: '@tannaers 100'
            }
        });
    }

    async messageRun(message, args) {
        const member = await args.pick('member').catch(() => null);
        let amount = await args.pick('string').catch(() => null);
        if (!member || !amount) return sendUsageEmbed(this, args, message);

        if (isFloat(amount)) {
            amount = parseFloat(amount);
            if (amount < 0) {
                return message.channel.send('You can only input positive numbers!');
            } else if (amount % 1 != 0) {
                return message.channel.send('You can only input whole numbers!');
            }
        } else {
            if (amount.toLowerCase() !== 'all') return sendUsageEmbed(this, args, message);
        }

        if (member.user.id === message.client.user.id) {
            const responses = [
                'You wanna give me money? THAT\'S MY MONEY!!!',
                'I don\'t need your pity money.',
                'I have more money than you can IMAGINE.',
                'Ask the gang they count the vault money.',
                'I tell you elsewhere go check there ¯\\_(ツ)_/¯',
                'Let\'s just say I have more than a certain billionaire. Probably. I suck at counting.'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        } else if (member.user.bot) {
            const responses = [
                'Why would you wanna give a computer program money?',
                'Well I don\'t let them in anyway so they have ZERO!!!',
                'As I said a million times, I don\'t let them have bank accounts here.',
                'ZERO. NULL. NONE. UNDEFINED.',
                'Fine let me check the back, I\'ll be back in 10 years.',
                'I\'ll give them **0 💵 Moneys**, just for you!'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        if (isFloat(amount) && amount > selfMoneys.amount) return message.channel.send(`You only have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);

        if (member.user.id === message.author.id) {
            if (isFloat(amount)) {
                return message.channel.send(`You just handed yourself **${amount.toLocaleString('en-US')} 💵 Moneys**! Fascinating! Now you have exactly the same amount you had before.`);
            } else if (!isFloat(amount) && amount.toLowerCase() === 'all' || isFloat(amount) && amount === selfMoneys.amount) {
                return message.channel.send(`You just handed yourself all of your **💵 Moneys**! Incredible! You still have exactly the same amount you had before.`);
            }
        }

        const Moneys = await fetchEconomyData(message, member.user.id);

        if (!isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfMoneys.amount;
            await Moneys.update({ amount: Moneys.amount + allOfIt });
            await selfMoneys.update({ amount: selfMoneys.amount - allOfIt });
            return message.channel.send(`Successfully gave ${member.user.username} **${allOfIt.toLocaleString('en-US')} 💵 Moneys**!`);
        } else {
            await Moneys.update({ amount: Moneys.amount + amount });
            await selfMoneys.update({ amount: selfMoneys.amount - amount });
            return message.channel.send(`Successfully gave ${member.user.username} **${amount.toLocaleString('en-US')} 💵 Moneys**!`);
        }
    }
}

module.exports = {
    GiveCommand
};
