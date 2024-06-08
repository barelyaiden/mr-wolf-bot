const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');

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
        const botChoice = sides[Math.floor(Math.random() * sides.length)];

        if (!choice || !choices.includes(choice) || !amount || isNaN(amount) || amount < 0) return message.channel.send(`**[🪙]** ${botChoice}!`);

        let fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });

        if (!fagBucks) {
            await message.client.FagBucks.create({
                userId: message.author.id,
                amount: 100
            });

            fagBucks = await message.client.FagBucks.findOne({ where: { userId: message.author.id } });
        }

        if (amount > fagBucks.amount) return message.channel.send(`You only have **${fagBucks.amount} 💵 FagBucks**!`);

        const randomChance = Math.random() * 100;
        let multiplier;

        if (randomChance <= 50) {
            multiplier = 2;
        } else if (randomChance <= 75) {
            multiplier = 2.5;
        } else if (randomChance <= 95) {
            multiplier = 3;
        } else if (randomChance <= 100) {
            multiplier = 4;
        }

        if (mapChoice[choice] === botChoice) {
            await fagBucks.update({ amount: (fagBucks.amount - amount) + (amount * multiplier) });
            return message.channel.send(`**[🪙]** ${botChoice}!\n**You win ${amount * multiplier} 💵 FagBucks!**`);
        } else {
            await fagBucks.update({ amount: fagBucks.amount - amount });
            return message.channel.send(`**[🪙]** ${botChoice}!\n**You lost ${amount} 💵 FagBucks!**`);
        }
    }
}

module.exports = {
    FlipCommand
};
