const { Command } = require('@sapphire/framework');
const random = require('random');
const commonMessages = require('../../utilities/commonMessages');
const typeCheckers = require('../../utilities/typeCheckers');

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
        if (!member || !amount) return commonMessages.sendUsageEmbed(this, message, args);
        if (typeCheckers.isFloat(amount)) {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount < 0) return commonMessages.sendUsageEmbed(this, message, args);
            if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');
        } else {
            if (amount.toLowerCase() !== 'all') return commonMessages.sendUsageEmbed(this, message, args);
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
                'I\'ll give them **0 💵 FagBucks**, just for you!'
            ];
            return message.channel.send(responses[random.int(0, responses.length - 1)]);
        }

        const selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (typeCheckers.isFloat(amount) && amount > selfFagBucks.amount) return message.channel.send(`You only have **${selfFagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);

        if (member.user.id === message.author.id) {
            if (typeCheckers.isFloat(amount)) {
                return message.channel.send(`You just handed yourself **${amount.toLocaleString('en-US')} 💵 FagBucks**! Fascinating! Now you have exactly the same amount you had before.`);
            } else if (!typeCheckers.isFloat(amount) && amount.toLowerCase() === 'all') {
                return message.channel.send(`You just handed yourself all of your **💵 FagBucks**! Incredible! You still have exactly the same amount you had before.`);
            }
        }

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: member.user.id,
                amount: 100,
                bank: 0
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: member.user.id } });
        }

        if (!typeCheckers.isFloat(amount) && amount.toLowerCase() === 'all') {
            const allOfIt = selfFagBucks.amount;
            await fagBucks.update({ amount: fagBucks.amount + allOfIt });
            await selfFagBucks.update({ amount: selfFagBucks.amount - allOfIt });
            return message.channel.send(`Successfully gave ${member.user.username} **${allOfIt.toLocaleString('en-US')} 💵 FagBucks**!`);
        } else {
            await fagBucks.update({ amount: fagBucks.amount + amount });
            await selfFagBucks.update({ amount: selfFagBucks.amount - amount });
            return message.channel.send(`Successfully gave ${member.user.username} **${amount.toLocaleString('en-US')} 💵 FagBucks**!`);
        }
    }
}

module.exports = {
    GiveCommand
};
