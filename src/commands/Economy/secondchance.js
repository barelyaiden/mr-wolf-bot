const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const random = require('random');
const { fetchEconomyData } = require('../../utilities/economyFunctions');

class SecondChanceCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'secondchance',
            aliases: ['sc'],
            description: 'Get a second chance at developing a gambling addiction!',
            cooldownDelay: Time.Day
        });
    }

    async messageRun(message) {
        const randomChance = random.int(0, 100);
        let loan = 100;
        if (randomChance <= 5) loan = 500;

        const selfMoneys = await fetchEconomyData(message, message.author.id);

        if (selfMoneys.amount !== 0) {
            await this.container.stores.get('preconditions').get('Cooldown').buckets.delete(this);
            return message.channel.send(`You already have **${selfMoneys.amount.toLocaleString('en-US')} 💵 Moneys**!`);
        }

        await selfMoneys.update({ amount: selfMoneys.amount + loan });
        return message.channel.send(`You have been given a second chance... at gambling!\n**You have received ${loan} 💵 Moneys!**`);
    }
}

module.exports = {
    SecondChanceCommand
};
