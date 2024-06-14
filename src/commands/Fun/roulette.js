const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const { sendUsageEmbed } = require('../../utilities/commonMessages');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class RouletteCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'roulette',
            aliases: ['r'],
            description: 'Play roulette!',
            detailedDescription: {
                usage: '[choice] [amount]',
                example: '16 500'
            },
            cooldownDelay: Time.Minute,
            cooldownLimit: 10
        });
    }

    async messageRun(message, args) {
        const choice = await args.pick('number').catch(() => null);
        const amount = await args.pick('number').catch(() => null);

        if (!choice || !amount || isNaN(choice) || isNaN(amount)) return sendUsageEmbed(this, args, message);
        if (amount < 0) return message.channel.send('You can only input positive numbers!');
        if (amount % 1 != 0 || choice % 1 != 0) return message.channel.send('You can only input whole numbers!');
        if (choice < 1 || choice > 36) return message.channel.send('Pick a number between 1 and 36!');
        if (amount > 1000) return message.channel.send('You can only gamble up to a maximum of **1,000 💵 Moneys**!');

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        if (amount > selfMoneys.amount) return message.channel.send(`You only have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);

        const botChoice = random.int(1, 36);
        const randomChance = random.int(0, 100);
        let multiplier = 2;

        if (randomChance <= 5) {
            multiplier = 5;
        } else if (randomChance <= 25) {
            multiplier = 4;
        } else if (randomChance <= 50) {
            multiplier = 3;
        }

        if (choice === botChoice) {
            await selfMoneys.update({ amount: (selfMoneys.amount - amount) + (amount * multiplier) });
            return message.channel.send(`**[🎲]** ${botChoice}!\n**You gained ${((amount * multiplier) - amount).toLocaleString('en-US')} 💵 Moneys!**`);
        } else {
            await selfMoneys.update({ amount: selfMoneys.amount - amount });
            return message.channel.send(`**[🎲]** ${botChoice}!\n**You lost ${amount.toLocaleString('en-US')} 💵 Moneys!**`);
        }
    }
}

module.exports = {
    RouletteCommand
};
