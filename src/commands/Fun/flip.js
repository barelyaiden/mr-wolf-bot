const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');

class FlipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'flip',
            aliases: ['coinflip', 'f'],
            description: 'Flip a coin!',
            detailedDescription: {
                usage: '(choice) (amount)',
                example: 'tails 50'
            },
            cooldownDelay: Time.Minute,
            cooldownLimit: 10
        });
    }

    async messageRun(message, args) {
        const choice = await args.pick('string').catch(() => null);
        const amount = await args.pick('number').catch(() => null);

        const choices = ['heads', 'head', 'h', 'tails', 'tail', 't'];
        const mapChoice = {
            'heads': 'Heads',
            'head': 'Heads',
            'h': 'Heads',
            'tails': 'Tails',
            'tail': 'Tails',
            't': 'Tails'
        };

        const sides = ['Heads', 'Tails'];
        const botChoice = sides[random.int(0, sides.length - 1)];

        if (!choice || !choices.includes(choice) || !amount || isNaN(amount) || amount < 0) return message.channel.send(`**[🪙]** ${botChoice}!`);
        if (amount % 1 != 0) return message.channel.send('You can only input whole numbers!');
        if (amount > 1000) return message.channel.send('You can only gamble up to a maximum of **1,000 💵 FagBucks**!');

        let selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!selfFagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100,
                bank: 0
            });

            selfFagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (amount > selfFagBucks.amount) return message.channel.send(`You only have **${selfFagBucks.amount.toLocaleString('en-US')} 💵 FagBucks**!`);

        const randomChance = random.int(0, 100);
        let multiplier = 2;

        if (randomChance <= 5) {
            multiplier = 4;
        } else if (randomChance <= 15) {
            multiplier = 3;
        }

        if (mapChoice[choice] === botChoice) {
            await selfFagBucks.update({ amount: (selfFagBucks.amount - amount) + (amount * multiplier) });
            return message.channel.send(`**[🪙]** ${botChoice}!\n**You gained ${((amount * multiplier) - amount).toLocaleString('en-US')} 💵 FagBucks!**`);
        } else {
            await selfFagBucks.update({ amount: selfFagBucks.amount - amount });
            return message.channel.send(`**[🪙]** ${botChoice}!\n**You lost ${amount.toLocaleString('en-US')} 💵 FagBucks!**`);
        }
    }
}

module.exports = {
    FlipCommand
};
